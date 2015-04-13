<?php
/**
 * Mapper abstract
 *
 * @package Common_Abstracts
 * @since   0.1
 *
 * @class Common_Abstracts_Mapper
 *
 * @property    string                      _dbTableName    Name of default database table storing model information
 * @property    array                       _map            Map of table field names pointing to model properties
 * @property    Common_Abstracts_Model      _model          Reference to respective model
 * @property    Zend_Db_Adapter_Abstract    _db             Reference to database adapter controlling query to tables
 * @property    Common_Abstracts_DbTable    dbTable         Default table object storing model information
 *
 */

abstract class Common_Abstracts_Mapper
{
    private     $_dbTable;
    protected
        $_db = null,
        $_dbTableName,
        $_className,
        $_map = [],
        $_model,
        $_findAllBy = [];

    public function __construct(Common_Abstracts_Model &$model)
    {
        $this->_className = get_class($this);

        if(!($model instanceof Common_Abstracts_Model)){
            throw new Exception('Instantiation of mapper class '.$this->_className.' did not pass associated model object to constructor.');
        }else{
            $this->_model = $model;
        }

//        $this->_model->SysMan->Logger->info($this->_className.'->construct()');

        $classArray = explode('_',$this->_className);
        // pop the model name from the class full name
        $modelName = array_pop($classArray);
        // pop the 'Mapper' string from the array
        array_pop($classArray);

        // Set dbTableName per default naming convention
        // This is only a default, models do not require a direct one-to-one relationship to a table, in fact it is likely not common
        $this->_dbTableName = implode('_',$classArray).'_DbTable_'.$modelName;
        $this->setDbTable($this->_dbTableName);
        // set the database adapter also at this time to avoid dependencies
        $this->_db = $this->getDbTable()->getAdapter();

        $this->init();

    }

    /**
     * Shell init() method called by abstract constructor.  Intent is to run additional code after construction, without
     * overriding the constructor.  The specific mapper needs only define an init() function.
     *
     */
    protected function init(){
    }

    /**
     * Returns an instance of the database table adapter.
     *
     * @return Common_Abstracts_DbTable
     */
    protected function getDbTable()
    {
        if(null === $this->_dbTable){
            $this->setDbTable($this->_dbTableName);
        }

        return $this->_dbTable;
    }

    public function setDbTable($dbTable)
    {
        if (is_string($dbTable)) {
            $dbTable = new $dbTable();
        }
        if (!$dbTable instanceof Zend_Db_Table_Abstract) {
            throw new Exception('Invalid table data gateway provided');
        }
        $this->_dbTable = $dbTable;
        return $this;
    }

    public function find($id = null)
    {
        if($id == null){
            // set to model id
            $id = $this->_model->id;
            // still null? throw exception
            if($id == null){
                $msg = $this->_className.' Mapper find() function executed without id identified in model or as parameter.';
                throw new Exception($msg);
            }
        }
        $this->_model->SysMan->Logger->info($this->_className.'->find() where id = '.$id);

        $rowSet = $this->getDbTable()->find($id);

        $count = count($rowSet);
        // There should only be one record or no record
        if ($count == 1) {
            /** @var  $result Zend_Db_Table_Row_Abstract*/
            $model = $rowSet->current();
            $model = $model->toArray(false);
            $model = $this->mapModel($this->_map,$model);
            $this->_model->SysMan->Logger->info($this->_className.'->find() success, set model from '.print_r($model,true));
            $this->_model->setFromArray($model);
            $success = true;
        }elseif($count == 0){
            $success = false;
        }else{
            throw new Exception('Find for '.$this->_className.' resulted in multiple records.  This is not expected.');
        }

        return $success;
    }

    /**
     * Generic findAll implementation for a simple query based on foreign keys grouping the records within the target
     * table.  This function returns an array of associative arrays representing the model in lieu of returning an
     * array of models.  In this manner, the model can use the result to set itself as appropriate or create an array
     * of models.
     *
     * @param array $by - OPTIONAL criteria for limiting record set, if not set, _findAllBy is used
     * @return array[] - array of associative arrays representing models
     * @throws Exception
     */
    public function findAll($by = null)
    {
        $addAnd = false;
        $where = '';

        if($by == null) {
            // set findAll criteria to default _findAllBy if not defined
            $by = $this->_findAllBy;
        }else{
            for($i=0;$i<count($by);$i++){
                // transform model properties to table fields
                $field = $this->_swapForField($by[$i]);
                if($field <> false){
                    $by[$i] = $field;
                }else{
                    throw new Exception($this->_className.'->findAll() called with model property = '.$by[$i].
                        '.  Property not found in Mapper map.');
                }
            }
        }

        if(count($by)>0){
            // first element is the order by
            $order = $by[0];

            // find all records based on foreign keys identified in _findAllBy
            foreach ($by as $fk) {
                $property = $this->_map[$fk];
                if (isset($this->_model->$property)) {
                    if(is_int($this->_model->$property)){
                        $value = $this->_model->$property;
                    }else{
                        $value = "'".$this->_model->$property."'";
                    }
                    // TODO: need to change where clause to use quoteInto method otherwise injection attack possible on login
                    if ($addAnd) {
                        $where = $where . ' And ' . $fk . ' = ' . $value;
                    } else {
                        $where = $fk . ' = ' . $value;
                    }
                    $addAnd = true;
                }
            }
        }else{
            throw new Exception($this->_className.'->findAll() called no criteria supplied in argument nor a default'.
                ' defined in protected Mapper->_map variable.');
        }

        $this->_model->SysMan->Logger->info($this->_className.'->findAll(); $where = '.$where);

        $resultSet = $this->getDbTable()->fetchAll($where,$order);

        $result   = array();
        // transform row set to an array of associative arrays representing the model
        foreach ($resultSet as $row) {
            $mappedRow = $this->mapModel($this->_map,$row->toArray());
            $result[] = $mappedRow;
        }

        $this->_model->SysMan->Logger->info($this->_className.'->findAll() results = '.print_r($result,true));

        return $result;
    }

    /**
     * This assumes mapper saves to associated table resulting from getDbTable().  If mapper needs to save to multiple dbTables,
     * use the _preSave() method to parse model into separate tables with the saveToTable() method.
     * !NOTE!: Zend_Db_Adapter_Abstract::Insert() requires that the primary key field be set to null
     * for a new insert to return the newly generated primary key.  This method unsets the primary key to insure that
     * the database save operation returns the primary key.  If you overwrite, insure that you do the same.  This method
     * functions based on the _model->id as the primary key.  If it is not, they this method must be overwritten accordingly.
     *
     * @return  int The primary key of the the affected row
     * @throws  Exception
     */
    public function save()
    {
        $this->_preSave();

        $targetTable = $this->getDbTable();
        $map = $this->_map;
        // The id property is the primary key for accessing database records
        $pk = $this->_model->id;

        $data = $this->mapModel($map);

        $this->_model->SysMan->Logger->info($this->_className.'->save() given table data = '.print_r($data,true));

        // remove primary key field for insert and update operations (for insert it insures return of $pk, for update modifying primary key not allowed
        if(isset($data[$targetTable->getPrimary()])){
            unset($data[$targetTable->getPrimary()]);
        }

        try {
            if (!is_null($pk) && $pk > 0) {
                // if id property set, then this save operation is an update
                $key = $targetTable->getPrimary();
                if(!is_array($key)){
                    $where[$key.' = ?'] = $pk;
                    $targetTable->update($data, $where);
                }else{
                    throw new Exception('Table '.$targetTable->getName().' has more than one primary key.  The '.
                    $this->_className.'.save() method only accounts for one.  You will need to update the abstract or override.');
                }
            } else {
//                $pkArray = $targetTable->getPrimary();
//                for($i=0;$i<=count($pkArray);$i++){
//                    if(isset($data[$pkArray[$i]])){
//                        unset($data[$pkArray[$i]]);
//                    }
//                }

                // Otherwise, the data is new and should be entered into a new database table row.
                $pk = $targetTable->insert($data);
                // set the model's id to primary key for usage is postSave methods as required
                $this->_model->id = $pk;
            }
        }
        catch (Exception $e) {
            throw new Exception('Exception thrown during '.$this->_className.'->save() method:  '.$e->getMessage());
        }

        $this->_postSave();

        $this->_model->SysMan->Logger->info($this->_className.'->save() complete, primary key returned = '.$pk);

        return $pk;
    }

    public function delete(){
        // TODO: define delete logic
        return true;
    }
    /**
     * Saves pertinent model properties to a specific database table as masked by the $map parameter.
     * !NOTE!: Zend_Db_Adapter_Abstract::Insert() requires that the primary key field be set to null
     * for a new insert to return the newly generated primary key.  This means you must insure that $pk is null
     * during insert operation so that this method will return the resulting primary key from the insert operation
     *
     * @param   Common_Abstracts_DbTable $targetTable    Table to receive model data as masked by $map
     * @param   array   $map    Explicit map of model properties to table field names
     * @param   int     $pk     The primary key value for this save operation
     * @return  int The primary key of the the affected row
     * @throws  Exception
     */
    public function saveToTable(Common_Abstracts_DbTable $targetTable, array $map, $pk)
    {
        $data = $this->mapModel($map);

        try {
            if (!is_null($pk) && $pk > 0) {
                // if id property set, then this save operation is an update
                $where[$targetTable->getPrimary().' = ?'] = $pk;
                $targetTable->update($data, $where);
            } else {
                // remove primary key field for insert operation to insure return of $pk
                if(isset($data[$targetTable->getPrimary()])){
                    unset($data[$targetTable->getPrimary()]);
                }
                // Otherwise, the data is new and should be entered into a new database table row.
                $pk = $targetTable->insert($data);
            }
        }
        catch (Exception $e) {
            throw new Exception('Exception thrown during '.$this->_className.'->save() method:  '.$e->getMessage());
        }

        return $pk;
    }

    protected function _swapForField($prop){
        return array_search($prop,$this->_map);
    }

    /**
     * Shell method supporting Mapper->save() functionality.  Specific Mapper class can override this method in order
     * to specify logic prior to inserting new data into or updating existing data within the DbTable.
     *
     */
    protected function _preSave()
    {
        // Create logic that precedes saving of data into the database.
    }

    /**
     * Shell method supporting Mapper->save() functionality.  Specific Mapper class can override this method in order
     * to specify logic following insertion of new data into or updating existing data within the DbTable.
     *
     */
    protected function _postSave()
    {
        // Create logic that precedes saving of data into the database.
    }

    /**
     * Translate model properties to the table field names based on state of $map variable.  Expectation is the $tableData
     * format is <table field name> => <model property>.  Only the mapped fields within this map will be saved to the
     * target table.  If the <model property> contained in the map does not exist in the model, then it is assumed as
     * a direct map of value to the table field.  This supports writing information to the table that may not exist
     * as a property of the model.
     *
     * @param   $map        array   The map to apply to the model, format must be property => table column
     * @param   $tableData  array   Only included when mapping table data to model properties
     * @return              array   Array of data to save per the table field names
     * @throws  Exception
     */
    protected function mapModel($map,$tableData = null){
        $ret = [];

        // when data array not included, intent is to build the array from model properties for save to DB table
        $setModel = !is_null($tableData);

        foreach($map as $field=>$prop){
            // the class property array as created by the abstract constructor applies initial capital to each property
            if (in_array($prop,$this->_model->properties) || in_array(ucfirst($prop),$this->_model->properties)){
                if($setModel){
                    // make sure map is correct
                    if (array_key_exists($field,$tableData)){
                        // create array of model property names set to the associated table field
                        $ret[$prop] = $tableData[$field];
                    }else{
                        // every field in the defined map should be in the retrieved table data
                        throw new Exception($this->_className.' map defined a field called '.$field.
                            ' that does not exist in source table');
                    }
                }else{
                    // intent here is to save table data to database
                    // create array of table field names set to the model property value
                    if(isset($this->_model->$prop)){
                        $ret[$field] = $this->_model->$prop;
                    }
                }
            }else{
                if(!$setModel){
                    // set the table field name directly to the value contained in the $map,
                    // this supports direct setting of table field value.
                    if(!is_null($prop)){
                        $ret[$field] = $prop;
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * Allows model to execute 'quoteInto' DB function for criteria based searches, without need to instantiate the DB adapter.
     * This only handles 'property = ?' criteria
     *
     * @param $criteria         - contains the query criteria referenced to model property name, such as "id = ?"
     * @param $value            - the value to scrub and insert into the "?" locations
     * @param null $dataType    - optional datatype for the $value
     * @returns string      - the criteria properly scrubbed for use in db queries
     */
    public function quoteInto($criteria,$value,$dataType = null){
        // loop through the map and replace any model property names with table field names
        foreach($this->_map as $field=>$property){
            $criteria = str_replace(' ','',$criteria);
            $criteria = str_replace($property.'=',$field.'=',$criteria);
            $criteria = str_replace($property.'>',$field.'>',$criteria);
            $criteria = str_replace($property.'<',$field.'=',$criteria);
        }
        return $this->_db->quoteInto($criteria,$value,$dataType);
    }


}