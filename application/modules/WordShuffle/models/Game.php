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
 * @property    int         roundAvg        average score per round
 * @property    int         points          summation of points in all rounds
 * @property    datetime    start           date time current game started
 * @property    datetime    end             date time current game ended
 * @property    WordShuffle_Model_Round[]       Rounds          array of Round objects
 * @property    int         Board
 * @property    string      state          - state of game as one of the constants: NEW_GAME, IN_PROGRESS, COMPLETED, and ABANDONED
 * @property    array       Squares         - game squares
 * @property    string         word        - current word
 * @property    array         wordSquares        - array of Square objects that created the word
 * @property    WordShuffle_Model_Mapper_Game Mapper    - explicitly define Mapper
 * @property    array         scoreBoard        - array of word scores
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
        $_end = null;

    // TODO:  Perhaps override _construct and determine if appropriate to set property, if not remove property from data array

    /**
     * Initialize Game model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
        // exclude from frontend response
        //$this->excludeFromJSON(array('state'));

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
        $this->SysMan->Session->gameStart = $x;
    }
    protected function getStart(){
        return $this->SysMan->Session->gameStart;
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
        $inError = false;
        if(count($value) == self::ROWS){
            if(count($value[0]) == self::COLS){
                // assumes an array of Square objects
                $this->_Squares = $value;
                $this->_writeSquaresToSession();
            }else{
                $inError = true;
            }
        }else{
            $inError = true;
        }

        if($inError){
            throw new Exception($this->className.'.setSquares() attempted against non-compliant value = '.print_r($value,true));
        }
    }
    protected function getSquares(){
        if($this->_Squares == null){
            $this->SysMan->Logger->info('Game.getSquares; session squares = '.print_r($this->SysMan->Session->Squares,true));
            if(count($this->SysMan->Session->Squares) !== 0){
                $i = 0;
                // set value from session information
                foreach($this->SysMan->Session->Squares as $row){
                    foreach($row as $square){
                        $this->_Squares[$i][] = new WordShuffle_Model_Game_Square($square);
                    }
                    $i++;
                }
            }else{
                $this->SysMan->Logger->info('Game.getSquares; initialize squares');
                $this->_Squares = $this->_initializeSquares();
                $this->_writeSquaresToSession();
            }
        }
        return $this->_Squares;
    }

    protected function setState($value){
        $options = array(self::NEW_GAME,self::IN_PROGRESS,self::COMPLETED,self::ABANDONED);
        if(in_array($value,$options)){
            $this->SysMan->Session->gameState = (string) $value;
        }else{
            throw new Exception($this->className.'->setState to disallowed value = '.$value);
        }
    }
    protected function getState(){
        if($this->SysMan->Session->gameState == null){
            $this->SysMan->Session->gameState = self::NEW_GAME;
        }
        return $this->SysMan->Session->gameState;
    }

    private $_word = null;
    protected function setWord($value){
        $this->_word = (string) $value;
    }
    protected function getWord(){
        return $this->_word;
    }

    private $_wordSquares = null;
    protected function setWordSquares($value){
        if(is_array($value)){
            // assumes set derives from request through API, which will be an array of PHP objects representing a Square object
            $this->_wordSquares = $value;
        }

    }
    protected function getWordSquares(){
        return $this->_wordSquares;
    }

    protected function getScoreBoard(){
        return $this->SysMan->Session->scoreBoard;
    }
    
    /*
     * New Game object requires creation of the associated Round objects that will be used during the Game
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     *
     */
    protected function _preInsert(){
        // this is a new game

        if($this->state <> self::IN_PROGRESS){
            $this->start = date("Y-m-d H:i:s");
            $this->state = self::IN_PROGRESS;
            $this->points = 0;
            $this->roundAvg = 0;

            // initialize game squares for sending to front end
            foreach($this->Squares as $row){
                foreach($row as $square){
                    $square->letter = $this->_randomLetter();
                }
            }
            $this->_writeSquaresToSession();
        }

        // any save invoked when player not authenticated equated to anonymous play
        if($this->SysMan->Session->signInState < Common_Models_SysMan::SIGNED_IN){
            $this->SysMan->Session->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;

            // no database save with anonymous play, set return value to false
            $continue = false;
        }else{
            $this->Mapper->abandonUncompletedGames();
            $continue = true;
        }

        return $continue;
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

                }
            }
        }else{
            // TODO:  save rounds as update
        }

        // set the session variable idPlayer to the results of the save operation
        if(!isset($session->idGame)){
            $session->idGame = $this->id;
        }elseif($session->idGame <> $this->id){
            throw new Exception('Session variable idGame does not match database records.');
        }

        $this->SysMan->Logger->info('END Game->_postSave()');

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

    public function submitWord(){
        $this->SysMan->Logger->info('Game.submitWord(), wordList = '.print_r($this->SysMan->Session->wordList,true));
        $msg = 'Rejected!';
        $success = true;

        // validate word with board layout
        if(count($this->wordSquares) < 2){
            $success = false;
            $msg = 'Word too short!';
        }else{
            $word = '';
            foreach($this->wordSquares as $square){
                $word = $word.$square->letter;
                // check the letter with the board stored in session
                if($this->SysMan->Session->Squares[$square->row-1][$square->col-1]['Letter'] != $square->letter){
                    $success = false;
                    $msg = 'Board Mismatch';
                }
            }
            if($word != $this->word){
                $success = false;
                $msg = 'Board Mismatch';
            }
        }

        // check current word list and see if it exists
        if(in_array($this->word,$this->SysMan->Session->wordList)){
            $msg = 'Duplicate';
            $success = false;
        }

        // look for word
        if($success){
            $success = $this->Mapper->findWord($this->word);
            if($success){
                $msg = 'Success!';
                $this->SysMan->Session->wordList = $this->word;
                $this->_scoreWord($this->word);
            }else{
                $msg = 'Rejected!';
            }
        }

        $return = array(
            'success'=> $success,
            'msg'=> $msg,
            'scoreBoard'=> $this->scoreBoard
        );

        $this->SysMan->Logger->info('Game.submitWord(); return = '.print_r($return,true));

        return $return;
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
    
    /**
     * Record score to records
     *
     * @private                 
     * @param   string  $word   - word to record on score board
     */
    private function _scoreWord($word)
    {
        $wordLength = strlen($word);

        switch($wordLength){
            case 2:
                $score = 2;
                break;
            case 3:
                $score = 3;
                break;
            case 4:
                $score = 5;
                break;
            case 5:
                $score = 7;
                break;
            case 6:
                $score = 9;
                break;
            default:
                $score = $wordLength + 3;
        }

        $scoreEntry = array(
            'word'=>    $word,
            'points'=>   $score
        );

        $this->SysMan->Session->scoreBoard = $scoreEntry;

        //array_push($this->_scoreBoard,$scoreEntry);
    }
    

    /**
     * Initialized Squares to an empty array of empty arrays
     *
     * @return array
     */
    private function _initializeSquares(){
        // the session object holds the current squares state
        $squares = array();
//        for($i=1;$i<=self::ROWS;$i++){
//            $squares[] = array();
//        }

        for($i=1;$i<=self::ROWS;$i++){
            $row = array();
            for($j=1;$j<=self::COLS;$j++){
                $row[] = new WordShuffle_Model_Game_Square(array(
                    'letter'        =>  'X',
                    'row'           =>  $i,
                    'col'           =>  $j,
                    'isSelected'    =>  false
                ));
            }
            $squares[] = $row;
        }

        return $squares;
    }

    private function _writeSquaresToSession(){
        $sessionSquares = array();
        $i = 0;
        foreach($this->_Squares as $row){
            /**
             * @var WordShuffle_Model_Game_Square $square
             */
            $sessionRow = array();
            foreach($row as $square){
                $sessionRow[] = $square->toArray();
            }
            $i++;
            $sessionSquares[] = $sessionRow;
        }
        $this->SysMan->Session->Squares = $sessionSquares;

    }
}