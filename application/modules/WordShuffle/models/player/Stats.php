<?php

/**
 * TODO: record description
 * 
 * @package WordShuffle_Model_Player
 * @class   WordShuffle_Model_Player_Stats
 * @property    int         idPlayer        - Id of the Player
 * @property    int         roundDuration        - Number of seconds in a round
 * @property    int         roundHigh        - Highest points scored in a particular round duration by a specific Player
 * @property    double      roundAvg        - Average points scored in a particular round duration by a specific player
 * @property    double      avgPtsPerWord        - Average points scored per word for a particular round duration
 * @property    double      avgWordCount        - Average number of words made against a particular round duration
 * @property    string      longestWord        - longest word found within a particular round duration by a specific Player
 * @property    int         totalRounds        - total number of rounds played for a particular round duration by a Player
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
    private $_idPlayer = null;
    protected function setIdPlayer($value){

    }
    protected function getIdPlayer(){
        $this->_idPlayer = $this->SysMan->Session->idPlayer;
        return $this->_idPlayer;
    }

    private $_roundDuration = null;
    protected function setRoundDuration($value){
        $this->_roundDuration = (int) $value;
    }
    protected function getRoundDuration(){
        return $this->_roundDuration;
    }

    private $_roundHigh = null;
    protected function setRoundHigh($value){
        $this->_roundHigh = (int) $value;
    }
    protected function getRoundHigh(){
        return $this->_roundHigh;
    }

    private $_roundAvg = null;
    protected function setRoundAvg($value){
        $this->_roundAvg = (double) $value;
    }
    protected function getRoundAvg(){
        return $this->_roundAvg;
    }

    private $_avgPtsPerWord = null;
    protected function setAvgPtsPerWord($value){
        $this->_avgPtsPerWord = (double) $value;
    }
    protected function getAvgPtsPerWord(){
        return $this->_avgPtsPerWord;
    }

    private $_avgWordCount = null;
    protected function setAvgWordCount($value){
        $this->_avgWordCount = (double) $value;
    }
    protected function getAvgWordCount(){
        return $this->_avgWordCount;
    }

    private $_longestWord = null;
    protected function setLongestWord($value){
        $this->_longestWord = (string) $value;
    }
    protected function getLongestWord(){
        return $this->_longestWord;
    }

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
     * compute player stats after each round
     * @public  compute
     * @param   Object     $roundDetails
     * @return  boolean
     */
    public function compute($roundDetails = null)
    {
        $this->SysMan->Logger->info('START '.'-> compute for id = '.$this->idPlayer.' and roundDuration = '.$roundDetails->roundDuration);
        $success = $this->Mapper->findStats($roundDetails->roundDuration, $this->idPlayer);
        if($success) {
            //recalculate model properties to perform update operation
            $totalRounds = $this->totalRounds;
            $this->totalRounds++;
            if ($roundDetails->points > $this->roundHigh)
                $this->roundHigh = $roundDetails->points;
            $this->roundAvg = ($this->roundAvg * $totalRounds + $roundDetails->points) / $this->totalRounds;
            $this->avgWordCount = ($this->avgWordCount * $totalRounds + $roundDetails->wordCount) / $this->totalRounds;
            $this->avgPtsPerWord = $this->roundAvg / $this->avgWordCount;
            if(strlen($roundDetails->longestWord) > strlen($this->longestWord))
                $this->longestWord = $roundDetails->longestWord;
        }
        else{
            // set model properties from method arguments for insert operation
            $this->totalRounds = 1;
            $this->roundHigh = $roundDetails->points;
            $this->roundAvg = $roundDetails->points;
            $this->avgWordCount = $roundDetails->wordCount;
            $this->avgPtsPerWord = $this->roundAvg / $this->avgWordCount;
            $this->longestWord = $roundDetails->longestWord;
            $this->roundDuration = $roundDetails->roundDuration;
        }
        $successSave = $this->save();
        $success = $this->Mapper->findStats($roundDetails->roundDuration, $this->idPlayer);
        $this->SysMan->Logger->info('END '.'-> compute for id = '.$this->idPlayer.' and roundDuration = '.$roundDetails->roundDuration);
        return $successSave;
    }

    /**
     * Player_Stats model logic executes find function.
     * @public
     * @param       int         $roundDuration      - to find the stats for particular round duration
     * @return      boolean                         - flags successful execution
     */
    public function find($roundDuration = null){

        $this->SysMan->Logger->info('START '.'->find() for id = '.$this->idPlayer.' and roundDuration = '.$roundDuration);
        $success = $this->Mapper->findStats($roundDuration, $this->idPlayer);
        if(!$success)
            $this->msg = array('type' => "warning", 'text' => 0);
        else
            $this->msg = array('type' => "success", 'text' => 1);
        $this->SysMan->Logger->info('END '.'->find() for id = '.$this->idPlayer.' and roundDuration = '.$roundDuration);
        return $success;
    }
    
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