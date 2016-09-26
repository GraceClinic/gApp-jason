<?php
// todo:  update docBlock with class description and properties
/**
 * << class description >>
 *
 * @package WordShuffle_Model_Player_Mapper
 *
 * @class WordShuffle_Model_Player_Mapper_Stats
 *  
 */
class WordShuffle_Model_Player_Mapper_Stats extends Common_Abstracts_Mapper
{
    protected 
        // todo:  create mapping between table fields and model properties (format is <table field> => <model prop>
        $_map = array(
            'id'            => 'id',
            'idPlayer'      => 'idPlayer',
            'roundDuration' => 'roundDuration',
            'roundHigh'     => 'roundHigh',
            'roundAvg'      => 'roundAvg',
            'avgPtsPerWord' => 'avgPtsPerWord',
            'avgWordCount'  => 'avgWordCount',
            'longestWord'   => 'longestWord',
            'totalRounds'   => 'totalRounds'
        ),
        // todo:  build find all array of foreign keys that index a group of records for this table
        $_findAllBy = array(
        );

    
	// todo:  document this function if you include it
    protected function init(){
		// todo:  extend constructor logic of abstract here, do not override the parent constructor
    }

	// todo:  determine if you will extend or override the find() method
    
    /**
     * build a query to find records from database(access dbTable here) based on duration and playerId
     *
     * @public                 
     * @param   int     $roundDuration
     * @return boolean
     * @throws Exception    roundDuration Not specified or resulted in multiple record hits for the given duration and id
     */
    public function find($roundDuration = -1)
    {
        $this->_model->SysMan->Logger->info($this->_model->className.'->find() where roundDuration = '.$roundDuration);
        $idPlayer = $this->_model->idPlayer;
        $_select = "";
        if ($roundDuration == -1) {
            $_subSql = $this->getDbTable()->select()->setIntegrityCheck(false);
            $_subSql->from($this->getDbTable(), array('longestWord'))
                    ->where('idPlayer = ?', $idPlayer)
                    ->order('length(longestWord) DESC')
                    ->limit(1);


            $_select = $this->getDbTable()->select()->setIntegrityCheck(false);
            $_select->from($this->getDbTable(), array('id', 'idPlayer', 'roundDuration', 'MAX(roundHigh) as roundHigh', '(SUM(roundAvg * totalRounds) / SUM(totalRounds)) as roundAvg', '(SUM(totalRounds * roundAvg) / SUM(totalRounds * avgWordCount)) as avgPtsPerWord', '(SUM(avgWordCount * totalRounds) / SUM(totalRounds)) as avgWordCount', 'SUM(totalRounds) as totalRounds'))
                    ->joinLeft(new Zend_Db_Expr('(' . $_subSql . ')'), '1=1', array('longestWord'))
                    ->where('idPlayer = ?', $idPlayer);
        }
        else {
            $_select = "idPlayer = $idPlayer AND roundDuration = $roundDuration";
        }
        //echo "full query" . $_select;
        $rowSet = $this->getDbTable()->fetchAll($_select);
        $this->_model->SysMan->Logger->info("rowset obtained after doing max" . print_r($rowSet, true));
        $count = count($rowSet);
        // There should only be one record or no record
        if ($count == 1) {
            $model = $rowSet->current();
            $model = $model->toArray(false);
            $model = $this->mapModel($this->_map,$model);
            $this->_model->SysMan->Logger->info($this->_model->className.'->find() success, set model from '.print_r($model,true));
            $this->_model->setFromArray($model);
            //$success = true;
        }elseif($count == 0){
            //$success = false;
            $this->_model->setFromArray(array(
                'roundDuration' =>  $roundDuration,
                'roundHigh' =>  0,
                'roundAvg'  =>  0,
                'avgPtsPerWord' =>  0,
                'avgWordCount'  =>  0,
                'longestWord'   =>  'N/A',
                'totalRounds'   =>  0
            ));
        }else{
            throw new Exception('Find for '.$this->_model->className.' resulted in multiple records.  This is not expected.');
        }

        return $rowSet->current();
    }

    /**
     * update the stats table at the end of a round
     *
     * @public
     * @param   array   $fetchedData
     * @param   object  $newData
     * @return  void
     */
    public function updateTable($fetchedData, $newData)
    {
        $this->_model->SysMan->Logger->info("fetched data in mappers" . print_r($fetchedData, true));
        //$_where = 'roundDuration = ' . $fetchedData->roundDuration . 'idPlayer = ' . $fetchedData->idPlayer;
        $_calculatedData = array();
        $_calculatedData['id'] = $fetchedData['id'];
        $_calculatedData['idPlayer'] = $fetchedData['idPlayer'];
        $_calculatedData['roundDuration'] = $fetchedData['roundDuration'];
        //$_calculatedData['roundAvg'] = $fetchedData['roundAvg'];
        $_calculatedData['roundHigh'] = $newData->points > $fetchedData['roundHigh'] ? $newData->points : $fetchedData['roundHigh'];
        $_calculatedData['roundAvg'] = ($fetchedData['roundAvg'] * $fetchedData['totalRounds'] + $newData->points) / ($fetchedData['totalRounds'] + 1);
        $_calculatedData['avgPtsPerWord'] = (($fetchedData['roundAvg'] * $fetchedData['totalRounds']) + $newData->points)/(($fetchedData['avgWordCount'] * $fetchedData['totalRounds']) + $newData->wordCount);
        $_calculatedData['avgWordCount'] = (($fetchedData['avgWordCount'] * $fetchedData['totalRounds']) + $newData->wordCount) / ($fetchedData['totalRounds'] + 1);
        $_calculatedData['longestWord'] = strlen($newData->longestWord) > strlen($fetchedData['longestWord']) ? $newData->longestWord : $fetchedData['longestWord'];
        $_calculatedData['totalRounds'] = $fetchedData['totalRounds'] + 1;
        $_where = "id = '$fetchedData[id]'";
        $this->_model->SysMan->Logger->info("calculated data" . print_r($_calculatedData, true) . "where" . $_where . "fetchedData" . print_r($fetchedData, true) . "new Data" . print_r($newData, true));
        $this->getDbTable()->update($_calculatedData, $_where);
    }

    /**
     * insertInto stats table
     *
     * @public
     * @param   object  $newData
     * @return  void
     */
    public function insertTable($newData)
    {
        $this->getDbTable()->insert($newData);
    }

	
	// todo:  determine if you will extend or override the findAll() method
	
	// todo:  determine if you will extend or override the save() method.  Zend_Db_Adapter_Abstract::Insert() requires that the primary key field be set to null for a new insert to return the newly generated primary key

    protected function _preSave()
    {
        // todo:  determine what you will do before a save operation, document if you include
    }

    protected function _postSave()
    {
        // todo:  determine what you will do after a save operation, document if you include
    }
 
}