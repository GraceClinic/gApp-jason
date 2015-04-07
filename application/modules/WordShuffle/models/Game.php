<?php

/**
 * Stores the current game state
 *
 * @package WordShuffle_Model
 *
 * @property    int         idPlayer        unique identifier for player
 * @property    int         timer           current timer count
 * @property    int         round           current round
 * @property    int         roundsPerGame   number of rounds in the game
 * @property    int         secondsPerRound seconds per round
 * @property    int         points          summation of points in all rounds
 * @property    datetime    start           date time current game started
 * @property    datetime    end             date time current game ended
 * @property    WordShuffle_Model_Round[]       Rounds          array of Round objects
 * @property    int         Board
 * @property    string      status          - status of game as one of the constants: NEW_GAME, IN_PROGRESS, COMPLETED, and ABANDONED
 * @property    WordShuffle_Model_Mapper_Game Mapper    - explicitly define Mapper
 */
class WordShuffle_Model_Game extends Common_Abstracts_Model
{
    const WORD_SHUFFLE = 1;
    const MAX_ROUNDS = 6;
    const MAX_SECONDS_PER_ROUND = 180;
    const NEW_GAME = 'New';
    const IN_PROGRESS = 'InProgress';
    const COMPLETED = 'Completed';
    const ABANDONED = 'Abandoned';

    // variable serving class properties
    private
        $_round = 1,
        $_roundsPerGame = 3,
        $_secondsPerRound = 180,
        $_roundAvg = 0,
        $_Rounds = null,
        $_Board = null,
        $_points = 0,
        $_start = null,
        $_end = null;

    /**
     * Initialize Game model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
        // exclude instructions property from JSON array, frontend does not require
        $this->excludeFromJSON(array('status'));

        // Game id should always agree with session variable, set this explicitly to address any post mangling
        $this->id = $this->SysMan->Session->idGame;

        // TODO: check sign-in state and adjust accordingly, currently frontend is maintaining game state after sign-out
        // if id not set, play is anonymous, store temp data within session variables
        if($this->id == 0){
            $this->secondsPerRound = $this->SysMan->Session->secondsPerRound;
            $this->roundsPerGame = $this->SysMan->Session->roundsPerGame;
        }else{
            // todo:  what next?
        }

    }

    protected function setIdPlayer(){
        // ignore, idPlayer only derives from session variables
    }
    protected function getIdPlayer(){
        return $this->SysMan->Session->idPlayer;
    }

    protected function setRound($x){
        $x = (int) $x;
        if(!is_int($x)){
            throw new Exception('Attempt to set Game->Round to non-integer value = '.$x);
        }
        if($x<0){
            throw new Exception('Attempt to set Game->Round to negative number = '.$x);
        }
        if($x>self::MAX_ROUNDS){
            throw new Exception('Attempt to set Game->Round to value greater than the limit of '.self::MAX_ROUNDS.' rounds, round = '.$x.'.');
        }
        $this->_round = $x;
    }
    protected function getRound(){
        return $this->_round;
    }

    protected function setSecondsPerRound($x){
        $x = (int) $x;
        if(!is_int($x)){
            throw new Exception('Attempt to set Game->secondsPerRound to non-integer value = '.$x);
        }
        if($x<0){
            throw new Exception('Attempt to set Game->secondsPerRound to negative number = '.$x);
        }
        if($x>self::MAX_SECONDS_PER_ROUND){
            throw new Exception('Attempt to set Game->secondsPerRound to value greater than the limit of '.self::MAX_SECONDS_PER_ROUND.' seconds, attempted to set = '.$x.'.');
        }
        $this->_secondsPerRound = $x;
    }
    protected function getSecondsPerRound(){
        return $this->_secondsPerRound;
    }

    protected function setRoundsPerGame($x){
        $x = (int) $x;
        if(!is_int($x)){
            throw new Exception('Attempt to set Game->MaxRound to non-integer value = '.$x);
        }
        if($x<0){
            throw new Exception('Attempt to set Game->MaxRound to negative number = '.$x);
        }
        if($x>self::MAX_ROUNDS){
            throw new Exception('Attempt to set Game->MaxRound to value greater than limit of '.self::MAX_ROUNDS.' rounds = '.$x.'.');
        }
        $this->_roundsPerGame = $x;
    }
    protected function getRoundsPerGame(){
        return (int) $this->_roundsPerGame;
    }

    protected function setRoundAvg($x){
        $this->_roundAvg = $x;
    }
    protected function getRoundAvg(){
        return $this->_roundAvg;
    }

    protected function setStart($x){
        $this->_start = $x;
    }
    protected function getStart(){
        return $this->_start;
    }

    protected function setEnd($x){
        $this->_end = $x;
    }
    protected function getEnd(){
        return $this->_end;
    }

    protected function setPoints($x){
        $this->_points = $x;
    }
    protected function getPoints(){
        return $this->_points;
    }

    protected function setRounds($x){
        if($x instanceof WordShuffle_Model_Round){
            $this->_Rounds[] = $x;
        }elseif(is_array($x)) {
            if(count($x) == $this->SysMan->Session->roundsPerGame){
                // if each element is a Round object simply set the value
                foreach($x as $round){
                    if($round instanceof WordShuffle_Model_Round){
                        // make sure idGame agrees with session
                        if($this->SysMan->Session->idGame == $round->idGame){
                            $this->_Rounds[] = $round;
                        }else{
                            // ignore disagreement and set rounds to NULL, postSave will reestablish with database, any new info is lost
                            $this->_Rounds = null;
                            break;
                        }
                    }else{
                        $this->Rounds[] = new WordShuffle_Model_Round($round);
                    }
                }
            }else{
                // disagreement with configuration and attempted set of Rounds, set rounds to NULL, postSave will reestablish with DB
                $this->_Rounds = null;
            }

        }else{
            throw new Exception(
                'Attempt to add an object to Game->Rounds that was not a WordShuffle_Model_Round object'
            );
        }
    }
    protected function getRounds(){
        return $this->_Rounds;
    }

    protected function setBoard($x){
        $this->_Board = $x;
    }
    protected function getBoard(){
        return $this->_Board;
    }

    private $_status = null;
    protected function setStatus($value){
        $options = array(self::NEW_GAME,self::IN_PROGRESS,self::COMPLETED,self::ABANDONED);

        if(in_array($value,$options)){
            $this->_status = (string) $value;
        }else{
            throw new Exception($this->className.'->setStatus to disallowed value = '.$value);
        }
    }
    protected function getStatus(){
        return $this->_status;
    }
    
    /*
     * New Game object requires creation of the associated Round objects that will be used during the Game
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     *
     */
    protected function _preInsert(){
        // this is a new game
        $this->Mapper->abandonUncompletedGames();

        // any save invoked when player not authenticated equated to anonymous play
        if($this->SysMan->Session->signInState < Common_Models_SysMan::SIGNED_IN){
            $this->SysMan->Session->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;

            // todo: update mapper to save information to session variables if state is anonymous, maybe variables always write to that location
            // need to track game status, start, end
        }else{
            $this->start = date("Y-m-d H:i:s");
            $this->status = self::IN_PROGRESS;
            $this->points = 0;
            $this->roundAvg = 0;
        }

        return true;
    }

    /*
     * New Game object requires creation of the associated Round objects that will be used during the Game
     *
     * @param WordShuffle_Model_Game $old
     * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     */
    protected function _preUpdate($old){
        // TODO:  Update points and roundAvg based on completed Rounds
        return true;
    }

    protected function _postSave(){
        $session = $this->SysMan->Session;
        $this->SysMan->Logger->info('START Game->_postSave()');

        if($this->Rounds == null){
            // if Rounds not defined, reestablish with DB record or this is a new Game needing new Rounds
            $roundModel = new WordShuffle_Model_Round(array(
                'idGame' => $this->id
            ));
            $rounds = $roundModel->findAll();
            $this->SysMan->Logger->info('Game->_postSave(); rounds found: '.print_r($rounds,true));
            if(count($rounds) > 0){
                for($x=0;$x<count($rounds);$x++){
                    $this->Rounds = new WordShuffle_Model_Round($rounds[$x]);
                    $this->Rounds[$x]->save();
                }
            }else{
                for($x=0;$x<$this->roundsPerGame;$x++) {
                    $this->Rounds = new WordShuffle_Model_Round(array(
                        'idGame' => $this->id,
                        'time' => $this->secondsPerRound
                    ));
                    $this->Rounds[$x]->save();
                }
            }
        }else{

        }


        // set the session variable idPlayer to the results of the save operation
        if(!isset($session->idGame)){
            $session->idGame = $this->id;
        }elseif($session->idGame <> $this->id){
            throw new Exception('Session variable idGame does not match database records.');
        }
    }

    public function buildBoard($rows=null,$cols=null){
        if($rows <> null && $cols <> null){
            $this->Board = new WordShuffle_Model_Board(array('rows'=>$rows,'cols'=>$cols));
        }else{
            $this->Board = new WordShuffle_Model_Board();
        }


    }

    public function start(){
        $this->start = date('Y-m-d H:i:s');
        $this->save();
    }

    protected function _validateModel(){
        // todo: validate game state
        return true;
    }
}