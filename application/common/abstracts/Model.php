<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 6/13/14
 * Time: 12:42 PM
 *
 * @class Common_Abstracts_Model
 *
 * @property    int         id                  unique identifier for the model and/or primary key identifying record in associated table
 * @property    string      idTag               tag identifying models presence within the DOM (for use by Javascript frontend)
 * @property    array       properties          Array of all the accessed class properties, either thru the set or get methods
 * @property    string      model               Name of the model, allows instantiation by the frontend
 * @property    string      mapperClassName     Name of the mapper class for instantiation as required
 * @property    string      className           - model class name
 * @property    object[]    msg                 - array of message objects keyed as ("type","text")
 * @property    Common_Abstracts_Mapper    Mapper      The mapper object for this model
 * @property    Common_Models_SysMan        SysMan      Convenient reference to global instance of application system manager
 */
abstract class Common_Abstracts_Model
{
    // private variables associated with intrinsic class properties
    private
        $_properties = array(),
        $_id = null,
        $_mapper = null,
        $_mapperClassName = "";

    // private variables used for internal functionality
    private
        // properties to exclude from the JSON array, exclude SysMan since it is very different between frontend and backend
        $_exclude = array('Mapper','MapperClassName','ClassName','Properties','SysMan'),
        $_className = "";

    /**
     * @param object null $data
     * @throws Exception
     */
    public function __construct($data = null)
    {
        $this->_className = get_class($this);

        $msg = 'START '.$this->_className.'->construct(), data = '.PHP_EOL.'{'.print_r($data,true).'}';
        $this->SysMan->Logger->info($msg,'Common_Abstracts_Model');

        // Model property set statically for transfer to JavaScript frontend and thereafter proper instantiation.
        // Since Zend names classes based on name space defined by directory structure, pop the last element off the array stack
        $classArray = explode('_',$this->_className);
        $model = array_pop($classArray);

        // set mapperClassName per default naming convention
        $this->_mapperClassName = implode('_',$classArray).'_Mapper_'.$model;
        //Populate model if needed
        if(isset($data)) {
            // array passed, set model properties accordingly
            if(is_array($data)) {
                $this->setFromArray($data);
            // object passed, set model properties accordingly
            }elseif(is_object($data)) {
                $this->setFromArray((array)$data);
            // integer passed, execute find based on value
            }elseif(is_integer((int)$data) && (int)$data !== 0){
                $this->find((int)$data);
            }else{
                throw new Exception(
                    'Unrecognized parameter passed during instantiation of '.$this->_className
                );
            }
        }


//        $this->SysMan->Logger->info('START '.$this->_className.'->_validateModel()','Common_Abstracts_Model');
//        if(!($this->_validateModel())){
//            throw new Exception($this->className.' failed _validateModel() on construction.');
//        };
//        $this->SysMan->Logger->info('END '.$this->_className.'->_validateModel()','Common_Abstracts_Model');

        $this->SysMan->Logger->info('START '.$this->_className.'->_init()','Common_Abstracts_Model');
        $this->init();
        $this->SysMan->Logger->info('END '.$this->_className.'->_init()','Common_Abstracts_Model');

        $msg = 'END '.$this->_className.'->construct(); model built: '.PHP_EOL.'{'.print_r($this->toArray(),true).'}';    //, model = '.print_r($this->toArray(),true);
        $this->SysMan->Logger->info($msg,'Common_Abstracts_Model');

    }

    /**
     * Shell init() method called by abstract constructor.  Intent is to run additional code after construction, without
     * overriding the constructor.  The specific Model object needs only define an init() function.
     *
     */
    protected function init(){
    }

    /**
     * Magic set function
     *
     * @param string $name
     * @param mixed  $value
     * @return Common_Abstracts_Model
     * @throws Exception
     */
    public function __set($name, $value)
    {
        $method = 'set' . ucfirst($name);
        if(isset($value)){
//            $this->SysMan->Logger->info($this->_className.'->__set(); $name = '.$name.'; isset($value) = '.isset($value));
            if (!method_exists($this, $method)) {
                // else choose error handler. Throw Exception, Log it, or message user
                throw new Exception("No Setter defined for " . $name . ".");
            }
        }
        return $this->$method($value);
    }
    /**
     * Magic get function
     *
     * @param $name
     * @return mixed
     * @throws Exception
     */
    public function __get($name)
    {
        $method = 'get' . ucfirst($name);
        if (method_exists($this, $method)) {
            return $this->$method();
        } else { // else choose error handler. Throw Exception, Log it, or message user
            throw new Exception("No Getter defined for ".$name.".");
        }
    }

    protected function setSysMan(){
        throw new Exception("Class ".get_class($this)." attempted to set SysMan, which is not allowed.");
    }
    protected function getSysMan(){
        // set reference to static instance of SysMan, the application state manager
        return Common_Models_SysMan::getInstance();
    }

    protected function setProperties($x){
//        if(!in_array($x,$this->_properties)){
//            $method = 'get' . ucfirst($x);
//            if (method_exists($this, $method)) {
//                $this->_properties[] = $x;
//            }else{
//                throw new Exception("Attempt to list property,".$x.", in class ".get_class($this)." that does not have a defined getter method");
//            }
//        }
    }
    protected function getProperties(){
        if(count($this->_properties) == 0){
            // create property array for class, since properties accessed through magic functions, it is necessary to
            // build a custom property array supporting iteration over model properties within various methods
            $methods = get_class_methods($this->_className);
            foreach($methods as $method){
                // all model methods prefixed with "get" assumed to be class properties based on access through magic function
                if(strpos($method,'get') === 0){
                    // property name is remaining string after "get"
                    $this->_properties[] = substr($method,3);
                }
            }
        }

        return $this->_properties;
    }

    protected function getMapper()
    {
        if (null === $this->_mapper) {
            if (!is_null($this->_mapperClassName)) {
                $this->_mapper = new $this->_mapperClassName($this);
            } else {
                throw new Exception("ERROR: Unable to instantiate mapper object. mapperClassName is null in class " . get_class($this));
            }
        }

        return $this->_mapper;
    }

    protected function setMapperClassName($x){
        $this->_mapperClassName = $x;
    }
    protected function getMapperClassName(){
        return $this->_mapperClassName;
    }

    protected function setClassName($value){
        throw new Exception(
            $this->className.' setClassName() not allowed!  Attempted to set value = '.$value.'.'
        );
    }
    protected function getClassName(){
        return (string) $this->_className;
    }

    protected function getId(){
        return $this->_id;
    }
    protected function setId($x){
        // Zend DbTable will only return primary key on insert if id = null, therefore never set to 0
        if($x != 0){
            $this->_id = (int) $x;
        }
    }

    private $_msg = null;
    protected function setMsg($value){
        $err = false;
        $keys = array('type','text');

        if($this->_msg == null){
            $this->_msg = array();
        }
        // assume clearing message array
        if($value == '' || $value == array()){
            $this->_msg = null;
        }
        // else if array, check keys and set
        elseif(is_array($value)){
            foreach($keys as $key){
                // could be just the one message or an array of messages
                if(!array_key_exists($key,$value)){
                    if(is_array($value[0]) && !array_key_exists($key,$value[0])){
                        $err = true;
                    }
                }
            }
            if(!$err){
                $this->_msg = $value;
            }
        }
        // else add entry to existing message array
        else{
            foreach($keys as $key){
                if(!array_key_exists($key,$value[0])){
                    $err = true;
                }
            }
            if(!$err){
                $this->_msg[] = $value;
            }
        }

        if($err){
            throw new Exception(
                $this->className."->msg set operation does not contain keys 'type' and 'text'."
            );
        }
    }
    protected function getMsg(){
        return $this->_msg;
    }

    /**
     * Query the mapper for a specific record by primary key
     *
     * @public
     * @param int   $id     - OPTIONAL uses model id if not present
     * @return Common_Abstracts_Model
     * @throws Exception
     */
    public function find($id = null)
    {
        $this->SysMan->Logger->info('START '.$this->_className.'->find() for id = '.$id);
        if($id == null || $id == 0){
            $id = $this->id;
        }
        if($id > 0){
            $success = $this->Mapper->find($id);
            if($success){
                // nothing
//                $success = $this->_validateModel();
//                if(!$success){
//                    throw new Exception(
//                        $this->_className.'->find() retrieved a record that does not fit validation criteria specified in _validateModel() method.');
//                }
            }else{
                throw new Exception($this->_className.' failure to find record id = '.$id);
            };
        }else{
            // explicitly setting model id to zero will override findall for this model
            if($this->id <> 0){
                // todo: execute findall?
            }
        }

        $this->SysMan->Logger->info('START '.$this->_className.'->postFind()');
        $success = $this->_postFind();
        $this->SysMan->Logger->info('END '.$this->_className.'->postFind(); success = '.$success);
        if(!$success){
            throw new Exception(
                $this->_className.'->_postFind() method flagged unsuccessful execution.');
        }

        $this->SysMan->Logger->info('END '.$this->_className.'->find()');

        return $this;
    }

    /**
     * Return an array records for the specific model as filtered by the provided array of model properties.  The mapper
     * method will concatenate the model properties using AND logic.  Anything more sophisticated must be created at
     * the specific model.
     *
     * @param array  $by          - array of model properties to use as grouping criteria for the findAll method
     * @return array
     */
    public function findAll($by = null)
    {
        $this->SysMan->Logger->info('START '.$this->_className.'->findAll() given $by = '.$by);

        $ret = $this->Mapper->findAll($by);

        $this->SysMan->Logger->info('END '.$this->_className.'->findAll(); return:  {'.PHP_EOL.print_r($ret,true).'}');

        return $ret;
    }

    /**
     * Save the model to the database.  Sets the model id as the primary key resulting from the mapper save operation.
     * The Mapper will only update / insert property values to the destination table if they are not NULL.
     *
     * @return int          - PK on success, 0 otherwise
     * @throws Exception
     */
    public function save()
    {
        $this->SysMan->Logger->info('START '.$this->_className.'->save()','Common_Abstracts_Model'); // given model = '.print_r($this->toArray(),true));

        $this->SysMan->Logger->info('START '.$this->className.'->_preSave()','Common_Abstracts_Model');
        $success = $this->_preSave();
        $this->SysMan->Logger->info('END '.$this->className.'->_preSave(); success = '.$success,'Common_Abstracts_Model');

        if($success){
            if (isset($this->id) && !is_null($this->id) && $this->id > 0) {
                $this->SysMan->Logger->info('START '.$this->_className.'->_preUpdate()','Common_Abstracts_Model');
                $success = $this->_preUpdate();
                $this->SysMan->Logger->info('END '.$this->_className.'->_preUpdate(); success = '.$success,'Common_Abstracts_Model');
            } else {
                $this->SysMan->Logger->info('START '.$this->_className.'->_preInsert()','Common_Abstracts_Model');
                $success = $this->_preInsert();
                $this->SysMan->Logger->info('END '.$this->_className.'->_preInsert(); success = '.$success,'Common_Abstracts_Model');
            }
        }

        if($success){
            $this->SysMan->Logger->info('START '.$this->_className.'->_validateSave()','Common_Abstracts_Model');
            //check properties against the model validator.
            $success = $success && $this->_validateSave();
            $this->SysMan->Logger->info('END '.$this->_className.'->_validateSave(); success = '.$success,'Common_Abstracts_Model');
        }

        if($success){
            $this->id = $this->Mapper->save();
        }else{
            $this->id = 0;
        }

        if($this->id <> 0){
            $this->SysMan->Logger->info('START '.$this->_className.'->_postSave()','Common_Abstracts_Model');
            $this->_postSave();
            $this->SysMan->Logger->info('END '.$this->_className.'->_postSave()','Common_Abstracts_Model');
        }else{
            $this->SysMan->Msg = array(
                "text"=>'Save of class '.$this->_className.' failed.',
                "code"=>Common_Models_Logger::ERRNO_MODEL_ERROR,
                "type"=>Common_Models_Logger::ERR
            );
        }

        $this->SysMan->Logger->info('END '.$this->_className.'->save(), id = '.$this->id,'Common_Abstracts_Model');

        return $this->id;
    }

    /**
     * Typical used to delete model information from database.
     *
     * @return boolean          - true on success, otherwise false
     */
    public function remove(){

        $success = $this->Mapper->delete();

        return $success;
    }

    /**
     * Validate model before a save operation. Called before mapper::Save()
     * **Override this function in each child model as needed**
     *
     * @return  bool    True    on valid data
     */
    protected function _validateSave(){
        //Please read the PHPDoc on this function
        return true;
    }

    /**
     * Typically a user cannot simply find any record he/she desires.  Session variables determine if the user should
     * have access to the retrieved record.  For example, if request is to find id=20, upon return if it is discovered
     * that record id = 20 belongs to user id = 5 and the session variable shows the current user id = 98, then this
     * is an obvious malicious attempt to obtain records that do not belong to the user.
     *
     * @return  bool        - returns true if validation is successful
     */
//    protected function _validateModel(){
//        // return false to insure that the developer always creates an appropriate find validation
//        return false;
//    }

    /**
     * Specific model logic that follows find function.  Override as required, otherwise ignore.
     *
     * @public
     * @return      boolean     - flags successful execution
     */
    protected function _postFind()
    {
        return true;
    }

    /**
     * Set model required model fields for an update
     *
     * @return boolean  Indication to save method that preSave succeeded; therefore, save can continue
     */
    protected function _preSave()
    {
        return true;
    }

    /**
     * Set model required model fields for an update.  Sometimes this requires gathering the existing record state
     * from the database and updating as appropriate.
     *
     * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     */
    protected function _preUpdate()
    {
        $this->SysMan->Logger->info($this->_className.'_preUpdate() not defined for id = '.$this->id);

        return true;
    }

    /**
     * Set required model fields for insertion into the database
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     */
    protected function _preInsert()
    {
        // create logic that precedes insert of data into the database
        return true;
    }

    /**
     * model logic that follows successful save to database
     *
     */
    protected function _postSave()
    {
        // create logic that follows successful save of model into the database
    }

    /**
     *Populate model from an associative array
     *
     * @param array $data
     * @throws Exception
     */
    public function setFromArray(array $data)
    {
        $success = false;

        foreach ($data as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (method_exists($this, $method)) {
                try {
                    $this->$key = $value;
                    $success = true;
                }
                catch (Exception $e) {
                    // ripple it up
                    throw $e;
                }
            }
        }

        if(!$success){
            throw new Exception('Attempt to set model from array yielded no properties set for model '.$this->_className.
                '; values to set were the following:  ('.implode(',',$data));
        }

    }

    /**
     * Return an array of model properties.
     *
     * @param   boolean $scrubExcludes  - flags removal of excluded properties for transfer to frontend
     * @return array model properties
     */
    public function toArray($scrubExcludes = true)
    {
        // list of model properties never translated
        $alwaysExclude = array('Mapper','Properties','SysMan');

        // TODO: Test to see if works when !scrubExcludes function, previously it returned a NULL
        $ret = Array();
        foreach ($this->properties as $prop){
            if($scrubExcludes){
                $proceed = !in_array(ucfirst($prop),$this->_exclude);
            }else{
                $proceed = !in_array(ucfirst($prop),$alwaysExclude);
            }
            // some properties excluded for transfer to frontend
            if($proceed){
                // TODO: object types are not translating in toArray
                if(is_object($this->$prop)) {
                    // recursively call toArray() for properties that are object types
                    if (method_exists($this->$prop, 'toArray')) {
                        // convert properties that are objects to JSON strings
                        $ret[$prop] = $this->$prop->toArray($scrubExcludes);
                        if (!$ret || $ret == '' || is_null($ret)) {
                            $ret = "";
                        }
                    } else {
                        // objects without toArray() method, simply copy as is
                        $ret[$prop] = $this->$prop;
                    }
                }elseif(is_array($this->$prop)){
                    $ret[$prop] = $this->_processArray($this->$prop,$scrubExcludes);
                }else{
                    $ret[$prop] = $this->$prop;
                }
            }

        }
        return $ret;
//        return (array)$this;
    }

    public function __toString()
    {
        $ret = get_class($this);
        foreach ($this as $name => $val) {
            if(is_array($val)){
                $val = implode('; ',$val);
            }
            $ret .= PHP_EOL . $name . ' => ' . $val;
        }
        return $ret;
    }

    public function __isset($key) {
        // When this function is called, PHP strips the key name from the argument object.  It is necessary to access
        // that property through the object setters and pass as a variable in the intrinsic isset function.
        $prop = $this->$key;
        return isset($prop);
    }

    /**
     * Converts model or passed object to JSON string for passing to frontend
     *
     * @param Common_Abstracts_Model $obj   A class object that will be converted to a JSON object string
     * @return string   JSON object string
     */
    public function toJSON(Common_Abstracts_Model $obj=null){
        $ret = '{';
        if($obj==null){
            $obj = $this;
        }

        foreach ($obj->properties as $prop){
            if(!in_array($prop,$this->_exclude) && !in_array(ucfirst($prop),$this->_exclude)){
                $val = $obj->$prop;
                $ret = $ret.'"'.$prop.'":';
                if(is_array($val)){
                    $ret = $ret.$obj->processArray($val).',';
                }elseif(is_object($val)){
                    $ret = $ret.$obj->processObject($val).',';
                }else{
                    // escape quotes
                    $val = addslashes($val);
                    // remove hard returns
                    $val = str_replace(array("\r", "\n"), '', $val);
                    // convert static properties
                    $ret = $ret.'"'.$val.'",';
                }

            }
        }
        // remove lagging comma
        $ret = rtrim($ret,',');
        $ret = $ret.'}';

        return $ret;
    }

    private function processObject($obj){
        if (method_exists($obj, 'toJSON')) {
            // convert properties that are objects to JSON strings
            $ret = $obj->toJSON();
            if(!$ret || $ret == '' || is_null($ret)){
                $ret = '"Object()"';
            }
        }else{
            // objects without toJSON method, simply show as Object()
            $ret = '"Object()"';
        }
        return $ret;
    }

    private function _processArray($arr,$scrubExcludes){
        $ret = array();

        // determine if array is associative
        if($this->isAssoc($arr)){
            foreach($arr as $key => $value){
                if(is_array($value)){
                    $ret[$key] = $this->_processArray($value,$scrubExcludes);
                }elseif(is_object($value)){
                    // recursively call toArray() for properties that are object types
                    if (method_exists($value, 'toArray')) {
                        // convert properties that are objects to JSON strings
                        $ret[$key] = $value->toArray($scrubExcludes);
                    }else{
                        // objects without toArray() method, simply copy as is
                        $ret[$key] = $value;
                    }
                }else{
                    $ret[$key] = $value;
                }
            }
        }elseif(is_object($arr[0])){
            // if first element is an object, process all as object
            foreach($arr as $obj){
                // recursively call toArray() for properties that are object types
                if (method_exists($obj, 'toArray')) {
                    // convert properties that are objects to JSON strings
                    $ret[] = $obj->toArray($scrubExcludes);
                }else{
                    // objects without toArray() method, simply copy as is
                    $ret[] = $obj;
                }
            }
        }elseif(is_array($arr[0])){
            foreach($arr as $arr2){
                $ret[] = $this->_processArray($arr2,$scrubExcludes);
            }
        }else{
            // array element is a simple data type, simply copy
            $ret = $arr;
        }

        return $ret;
    }
    private function processArray($arr){
        $ret = "";
        // determine if array is associative
        if($this->isAssoc($arr)){
            $ret = '{';
                foreach($arr as $key => $value){
                    if(is_array($value)){
                        $ret = $ret.'"'.$key.'":'.$this->processArray($value).',';
                    }elseif(is_object($value)){
                        $ret = $ret.'[';
                        foreach($value as $obj){
                            $ret = $ret.$this->processObject($obj).',';
                        }
                        $ret = rtrim($ret,',').']';
                    }else{
                        // escape quotes
                        $value = addslashes($value);
                        // remove hard returns
                        $value = str_replace(array("\r", "\n"), '', $value);

                        $ret = $ret.'"'.$key.'":"'.$value.'",';
                    }
                }
                $ret = rtrim($ret,',').'}';
        }elseif(is_object($arr[0])){
            // if first element is an object, process all as object
            $ret = $ret.'[';
            foreach($arr as $obj){
                $ret = $ret.$this->processObject($obj).',';
            }
            $ret = rtrim($ret,',').']';
        }elseif(is_array($arr[0])){
            $ret = $ret.'[';
            foreach($arr as $arr2){
                $ret = $ret.$this->processArray($arr2).',';
            }
            $ret = rtrim($ret,',').']';
        }else{
            // array element is a simple data type, convert properties that are arrays to JSON string
            $ret = '["'.implode('","',$arr).'"]';
        }

        return $ret;
    }

    private function isAssoc($arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    public function excludeFromJSON(array $props){
        foreach($props as $propName){
            // enter properties in exclusion array as upper case first to match with properties array
            $this->_exclude[] = ucfirst($propName);
            // unset value from property array if it exists
//            $key = array_search($propName, $this->_properties);
//            if(!$key){
//                $key = array_search(ucfirst($propName),$this->properties);
//            }
//            if($key){
//                unset($this->_properties[$key]);
//            };
        }
    }

}
