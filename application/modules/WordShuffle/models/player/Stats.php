<?php

/**
 * TODO: record description
 * 
 * @package WordShuffle_Models_Player
 * @class   WordShuffle_Models_Player_Stat.php
 */
class WordShuffle_Model_Player_Stats extends Common_Abstracts_Model
{

    /*****************************
     * CLASS CONSTANTS declaration
     *****************************/
    // todo: itemize class constants

    /**
     * << description of init >>
     * Typically, this method validates the properties with session state to determine if it is appropriate.
     * Also, this is the time for writing session information as appropriate.
     *
     **/
    protected function init()
    {
		parent::init();
		
		// todo: itemize any model properties which should be excluded from the model when sending response
		$this->excludeFromJSON(array(
		    
        ));
        
		// todo:  determine extension of constructor logic, do not override original init() function, only extend it

    }

    /************************************
     * MODEL PROPERTIES SETTERS / GETTERS
     ************************************/
    // todo:  use "php_prop" live template to insert new properties
    
    // todo: move property docblock to top of class
    /**
     * @property    int         idPlayer        -this is the player-Id whose record it belongs
     */
    private $_idPlayer = null;
    protected function setIdPlayer($value){
        $this->SysMan->Logger->info("Illegal, idPlayer is not supposed to be set in  the stats model");
    }
    protected function getIdPlayer(){
        return $this->SysMan->Session->idPlayer;
    }

    // todo: move property docblock to top of class
    /**
     * @property    int         roundDuration        -roundDuration
     */
    private $_roundDuration = null;
    protected function setRoundDuration($value){
        $this->_roundDuration = (int) $value;
    }
    protected function getRoundDuration(){
        return $this->_roundDuration;
    }


    // todo: move property docblock to top of class
    /**
     * @property    int         roundHigh        -roundHigh
     */
    private $_roundHigh = null;
    protected function setRoundHigh($value){
        $this->_roundHigh = (int) $value;
    }
    protected function getRoundHigh(){
        return $this->_roundHigh;
    }

    // todo: move property docblock to top of class
    /**
     * @property    float         roundAvg        -roundAvg
     */
    private $_roundAvg = null;
    protected function setRoundAvg($value){
        $this->_roundAvg = (float) round($value, 1);
    }
    protected function getRoundAvg(){
        return $this->_roundAvg;
    }

    // todo: move property docblock to top of class
    /**
     * @property    float         avgPtsPerWord        - average points per word
     */
    private $_avgPtsPerWord = null;
    protected function setAvgPtsPerWord($value){
        $this->_avgPtsPerWord = (float) round($value, 1);
    }
    protected function getAvgPtsPerWord(){
        return $this->_avgPtsPerWord;
    }

    // todo: move property docblock to top of class
    /**
     * @property    float         avgWordCount        - average number of words in a round
     */
    private $_avgWordCount = null;
    protected function setAvgWordCount($value){
        $this->_avgWordCount = (float) round($value, 1);
    }
    protected function getAvgWordCount(){
        return $this->_avgWordCount;
    }

    // todo: move property docblock to top of class
    /**
     * @property    string         longestWord        -longest Word
     */
    private $_longestWord = null;
    protected function setLongestWord($value){
        $this->_longestWord = (string) $value;
    }
    protected function getLongestWord(){
        return $this->_longestWord;
    }

    // todo: move property docblock to top of class
    /**
     * @property    int         totalRounds        - total number of rounds
     */
    private $_totalRounds = null;
    protected function setTotalRounds($value){
        $this->_totalRounds = (int) $value;
    }
    protected function getTotalRounds(){
        return $this->_totalRounds;
    }

    

    /****************************************
     * MODEL PUBLIC METHODS declaration / definition
     ****************************************/
    // todo:  use "php_method" live template to insert new methods
    
    /**
     * compute method to calculate the given rounds stats and update wsstats
     *
     * @public                 
     * @param               - todo: document all parameters
     * @return void
     * @throws Exception
     */
    public function compute($args)
    {
        //$this->SysMan->Logger->info("parameters received" . print_r($args, true));
        if(!$this->SysMan->Session->idPlayer) {
            return;
        }
        $_rowset = $this->Mapper->find($args->roundDuration);
        //$this->SysMan->Logger->info("rowset obtained" . print_r($_rowset, true));
        if ($_rowset) {
            //$this->SysMan->Logger->info("update these fields");
            $this->Mapper->updateTable($_rowset->toArray(false), $args);
        }
        else {
            //$this->SysMan->Logger->info("insert new record");
            $_fullRecord = array("idPlayer" => $this->idPlayer, "roundDuration" => $args->roundDuration, "roundHigh" => $args->points, "roundAvg" => $args->points, "avgPtsPerWord" => $args->points/$args->wordCount, "avgWordCount" => $args->wordCount, "longestWord" => $args->longestWord, "totalRounds" => 1);
            $this->Mapper->insertTable($_fullRecord);
        }
    }
    

    /**
     * find method of Model.php overridden to find the records based on roundDuration and id
     *
     * @public
     * @param   int $roundDuration
     * @return $this
     * @throws Exception this should be an InvalidArgumentException, thrown when roundDuration not specified
     */
    public function find($roundDuration = -1)
    {
        $this->SysMan->Logger->info('START overridden'.$this->className.'->find() for roundDuration = '.$roundDuration);
//        if($roundDuration == null || $roundDuration == 0){
//            $roundDuration = $this->_roundDuration;
//        }
        if($roundDuration >= -1){
            $success = $this->Mapper->find($roundDuration);
        }else{
            // explicitly setting model id to zero will override findall for this model
            if($this->_roundDuration <> 0){
                // todo: execute findall?
            }
        }

        $this->SysMan->Logger->info('START '.$this->className.'->postFind()');
        $success = $this->_postFind();
        $this->SysMan->Logger->info('END '.$this->className.'->postFind(); success = '.$success);
        if(!$success){
            throw new Exception(
                $this->className.'->_postFind() method flagged unsuccessful execution.'
            );
        }

        $this->SysMan->Logger->info('END '.$this->className.'->find()');

        return $this;
    }


    /************************************
     * MODEL PRIVATE FUNCTIONS definition
     ************************************/
    // todo: use "php_func" live template to insert to functions
    
    /**
     * Specific model logic that follows find function.  Override as required, otherwise ignore.
     *
     * @protected
     * @return      boolean     - flags successful execution
     */
    protected function _postFind()
    {
        return true;
    }
    
    /**
     * << description of preInsert >>
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     *
     **/
    protected function _preInsert(){
        $success = true;
        
        // todo: determine if preInsert process required prior to table inserts
        
        return $success;
    }

    /**
     *  << description of preUpdate >>
     *  This may require gathering existing data from the database as validating or maintaining as appropriate
     *
      * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     **/
    protected function _preUpdate(){
         $success = true;
         
       // TODO:  determine if preUpdate process required prior to table update
        
        return $success;
    }

    /**
     * This is logic common to an insert or an update to the database
     *
     * @public
     * @return  boolean
     */
    public function _preSave()
    {
        // todo: define method
        return true;
    }
    
    /**
     * << description of preInsert >>
     *
     * @return boolean  Indication to save method that postSave succeeded; therefore, save can continue
     *
     **/
    protected function _postSave(){
         $success = true;
         
       // TODO:  determine if postSave process required after table update/insert
        
        return $success;
    }

}