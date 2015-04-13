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
 * @property    array       Squares         - game squares
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
    const ROWS = 5;
    const COLS = 5;

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

    // TODO:  Perhaps override _construct and determine if appropriate to set property, if not remove property from data array

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
                        $this->_Rounds[] = new WordShuffle_Model_Round($round);
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

    private $_Squares = null;
    protected function setSquares($value){
        $this->_Squares = $value;
        $this->SysMan->Logger->info('Game->setSquares; $value = '.print_r($value,true));
        if(count($this->_Squares) !== 0){
            $this->SysMan->Session->Squares = array();
            $squares = array();
            foreach($this->_Squares as $row){
                $newRow = array();
                foreach($row as $square){
                    $newRow[] = $square->toArray();
                }
                $squares = $newRow;
            }
            $this->SysMan->Session->Squares = $squares;
        }

    }
    protected function getSquares(){
        if($this->_Squares == null){
            if(count($this->SysMan->Session->Squares) !== 0){
                foreach($this->SysMan->Session->Squares as $square){
                    $this->_Squares[] = new WordShuffle_Model_Game_Square($square);
                }
            }
        }
        return $this->_Squares;
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
            if(count($rounds) > 0){
                // do nothing, rounds constructed from database
            }else{
                for($x=0;$x<$this->roundsPerGame;$x++) {
                    $data = array(
                        'idGame' => $this->id,
                        'time' => $this->secondsPerRound
                    );
                    if($x==0) {
                        $data['start'] = date('Y-m-d H:i:s');
                    }
                    $this->Rounds = new WordShuffle_Model_Round($data);
                    $this->Rounds[$x]->save();

                    // initialize game squares for sending to front end
                    $squares = array();
                    for($i=1;$i<=self::ROWS;$i++){
                        $row = array();
                        for($j=1;$j<=self::COLS;$j++){
                            $row[] = new WordShuffle_Model_Game_Square(array(
                                'letter'        =>  $this->_randomLetter(),
                                'row'           =>  $i,
                                'col'           =>  $j,
                                'isSelected'    =>  false
                            ));
                        }
                        $squares[] = $row;
                    }
                    $this->SysMan->Logger->info('Game->_postSave(); squares created');
                    $this->Squares = $squares;

                }
            }
        }else{
            // TODO:  save rounds
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
        $success = true;

        if(count($this->Rounds) > 0){
            if($this->Rounds[0]->idGame !== $this->id){
                $success = false;
                $this->SysMan->Logger->err('Round object passed references a Game id that is not correct.');
            }
        }
        return $success;
    }

    /**
     * Generates a random letter based on frequency distribution of letters
     *
     * @private
     * @return string
     */
    private function _randomLetter()
    {
        // create map for relative frequency of the first letters of a word, ref http://en.wikipedia.org/wiki/Letter_frequency
        $map = array(
            'A' => 11.602,       // frequency of A = 11.602%
            'B' => 4.702,
            'C' => 3.511,
            'D' => 2.67,
            'E' => 2.007,
            'F' => 3.779,
            'G' => 1.95,
            'H' => 7.232,
            'I' => 6.286,
            'J' => 0.597,
            'K' => 0.59,
            'L' => 2.705,
            'M' => 4.374,
            'N' => 2.365,
            'O' => 6.264,
            'P' => 2.545,
            'Q' => 0.173,
            'R' => 1.653,
            'S' => 7.755,
            'T' => 16.671,
            'U' => 1.487,
            'V' => 0.649,
            'W' => 6.753,
            'X' => 0.037,
            'Y' => 1.62,
            'Z' => 0.034
        );

        $random = (float)rand()/(float)getrandmax()*100;

        $return = 0;
        $sum = 0;
        foreach($map as $letter=>$value){
            $sum = $sum + $value;
            if($random<$sum){
                $return = $letter;
                break;
            }
        }
        return (string)$return;
    }

}