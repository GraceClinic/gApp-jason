<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 11/6/14
 * Time: 7:55 PM
 */
/**
 * Class WordShuffle_Model_Game_Round
 *
 * @property    int         idGame          unique identifier for game record
 * @property    int         time            time allotted to play round
 * @property    int         wordCount       number of words created during the round
 * @property    int         points          points scored during the round
 * @property    string    start             date time string current game started
 * @property    string    end               date time string current game ended
 * @property    int         index        - index of Round in collection
 */
class WordShuffle_Model_Game_Round extends WordShuffle_Model_Abstract
{
    public function __construct($data = null){
        // make sure index set first because all other properties require it
        if($data != null && !is_integer($data)){
            $data = (array) $data;
            if(array_key_exists("index",$data)){
                $this->index = $data['index'];
                //unset($data['index']);
            }
        }


        parent::__construct($data);
    }
    /**
     * Initialize Round model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
    }

    protected function setIdGame($x){
        $this->SysMan->Session->updateRound($this->index,'idGame',(int) $x);
    }
    protected function getIdGame(){
//        $round = $this->SysMan->Session->Rounds[$this->index];
//        return (int) $round['idGame'];
        return $this->SysMan->Session->idGame;
    }

    protected function setTime($x){
        $this->SysMan->Session->updateRound($this->index,'time',(int) $x);
    }
    protected function getTime(){
        $round = $this->SysMan->Session->Rounds[$this->index];
        return $round['time'];
    }

    protected function setWordCount($x){
        $this->SysMan->Session->updateRound($this->index,'wordCount',(int) $x);
    }
    protected function getWordCount(){
        $round = $this->SysMan->Session->Rounds[$this->index];
        return $round['wordCount'];
    }

    protected function setPoints($x){
        $this->SysMan->Session->updateRound($this->index,'points',(int) $x);
    }
    protected function getPoints(){
        $round = $this->SysMan->Session->Rounds[$this->index];

        return $round['points'];
    }

    protected function setStart($x){
        if(!is_null($x)){
            $x = (string) $x;
        }
        $this->SysMan->Session->updateRound($this->index,'start',$x);
    }
    protected function getStart(){
        return $this->SysMan->Session->Rounds[$this->index]['start'];
    }

    protected function setEnd($x){
        if(!is_null($x)){
            $x = (string) $x;
        }
        $this->SysMan->Session->updateRound($this->index,'end',$x);
    }
    protected function getEnd(){
        $round = $this->SysMan->Session->Rounds[$this->index];
        return $round['end'];
    }

    private $_index = 0;
    protected function setIndex($value){
        $value = (int) $value;
        if($value < count($this->SysMan->Session->Rounds)){
            $this->_index = $value;
            $this->SysMan->Session->updateRound($this->_index,'index',$value);
        }else{
            throw new Exception('setIndex() called with value larger than collection of Rounds stored in session, passed value = '.$value);
        }
    }
    protected function getIndex(){
        return $this->_index;
    }

    /**
     * reset the round information for a new game
     *
     * @public
     */
     public function reset()
    {
        $this->wordCount = 0;
        $this->points = 0;
        $this->start = null;
        $this->end = null;
        $this->id = 0;
    }

    /**
     * Determine is save operation proceeds
     *
     * @return boolean  Indication to save method that preSave succeeded; therefore, save can continue
     */
    protected function _preSave()
    {
        // any save invoked when player not authenticated equates to anonymous play
        if($this->SysMan->Session->signInState < Common_Models_SysMan::SIGNED_IN) {
            $this->SysMan->Session->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;
            // no database save with anonymous play, set return value to false
            $continue = false;

            // populate Round information with session storage
        }else{
            // set flag so that postSave action will occur and save Game to database
            $continue = true;
        }

        return $continue;
    }

    protected function _validateModel(){
        // todo: validate game state
        return true;
    }
}