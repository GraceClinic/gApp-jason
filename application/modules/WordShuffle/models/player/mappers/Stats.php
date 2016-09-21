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

    /**
     * To find stats for a player
     * @public  findStats
     * @param   int         $roundDuration
     * @param   int         $idPlayer
     * @return  boolean
     * @throws  Exception
     */
    public function findStats($roundDuration = 0, $idPlayer = 0)
    {
        $resultSet = null;
        if($idPlayer == 0)
        {
            $success = false;
            return $success;
        }
        else if($roundDuration > 0) {
            $where = array(
                "roundDuration = '$roundDuration'",
                "idPlayer = '$idPlayer'"
            );
            $resultSet = $this->getDbTable()->fetchAll($where);
        }
        else if($roundDuration == 0){
            $select = $this->getDbTable()->select()->from(
                $this->getDbTable())->where('CHAR_LENGTH(longestWord) = ?',
                $this->getDbTable()->select()->from(
                    $this->getDbTable(), array('max(CHAR_LENGTH(longestWord))'))
                    ->where('idPlayer = ?', $idPlayer))
                ->where('idPlayer = ?', $idPlayer)
                ->limit(1);

            $result = $this->getDbTable()->fetchAll($select);
            if(count($result) == 1) {
                $model = $result->current();
                $select = $this->getDbTable()->select()->from(
                    $this->getDbTable(),
                    array('id',
                        'idPlayer',
                        'roundDuration',
                        'roundHigh' => 'max(roundHigh)',
                        'roundAvg' => '(sum(roundAvg * totalRounds)/sum(totalRounds))',
                        'avgPtsPerWord' => '(sum(avgPtsPerWord * totalRounds)/sum(totalRounds))',
                        'avgWordCount' => '(sum(avgWordCount * totalRounds)/sum(totalRounds))',
                        'longestWord' => "('$model[longestWord]')",
                        'totalRounds' => '(sum(totalRounds))'
                    ))->where('idPlayer = ?', $idPlayer);
                $resultSet = $this->getDbTable()->fetchAll($select);
            }
            else if(count($result) == 0){
                $success = false;
                return $success;
            }
            else{
                throw new Exception('Find for '.$this->_className.' resulted in multiple records.  This is not expected.');
            }
        }
        else{
            throw new Exception('Find for '.$this->_className.' with round Duration '.$roundDuration. ' is not valid');
        }
        $count = count($resultSet);
        // There should only be one record or no record
        if ($count == 1) {
            $model = $resultSet->current();
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