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
 * @property    string    start             date time string current game started
 * @property    string    end               date time string current game ended
 * @property    WordShuffle_Model_Game_Round[]       Rounds          array of Round objects
 * @property    int         Board
 * @property    string      state          - state of game as one of the constants: NEW_GAME, IN_PROGRESS, COMPLETED, and ABANDONED
 * @property    array       Squares         - game squares
 * @property    string         word        - current word
 * @property    array         wordSquares        - array of Square objects that created the word
 * @property    WordShuffle_Model_Mapper_Game Mapper    - explicitly define Mapper
 * @property    array         scoreBoard        - array of word scores
 * @property    boolean         newGame        - flags new game event
 * @property    boolean         newRound        - flags new round event
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
    const NEW_ROUND = 'NewRound';
    const ROWS = 5;
    const COLS = 5;

    // variable serving class properties
    private
        $_roundAvg = 0,
        $_Rounds = null,
        $_Board = null,
        $_points = 0;

    // TODO:  Perhaps override _construct and determine if appropriate to set property, if not remove property from data array
    /**
     * @param array $data
     */
    public function __construct($data = null){
        $_remove = array('round','start','end','points','idPlayer','roundAvg','scoreBoard','state');

        if($data != null){
            if(is_integer($data) && (int)$data !== 0){
                $data = (int)$data;
            }else{
                $data = (array) $data;
                // remove properties from data array that are not allowed to be set during construction
                foreach($data as $prop=>$value){
                    if(in_array($prop,$_remove)){
                        unset($data[$prop]);
                    }
                }
            }

        }

        // any game construction invoked when player not authenticated equates to anonymous play
        if($this->SysMan->Session->signInState < Common_Models_SysMan::SIGNED_IN) {
            $this->SysMan->Session->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;
        }

        if($data != null && array_key_exists('newGame',$data) && $data['newGame'] && $this->state != self::IN_PROGRESS){
            // reset the game id before any find or save operation so that a new Game is created
            $this->SysMan->Session->idGame = 0;
        }

        // Game id should always agree with session variable, set this explicitly to address any post mangling
        $this->id = $this->SysMan->Session->idGame;

        // explicitly set the id per the session storage before construction, which will trigger find method if it is the only parameter
        $data['id'] = $this->id;

//        if(isset($data->id)){
//        }

        parent::__construct($data);

    }

    /**
     * Initialize Game model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
        // exclude from frontend response
        $this->excludeFromJSON(array('Word','WordSquares'));

        // translate model properties to session variables as appropriate
        if(!$this->state || $this->state == self::COMPLETED || $this->state == self::ABANDONED){
            // Session object will update the Rounds accordingly
            $this->SysMan->Session->secondsPerRound = $this->secondsPerRound;
            $this->SysMan->Session->roundsPerGame = $this->roundsPerGame;
        }
        else{
            if($this->secondsPerRound != $this->SysMan->Session->secondsPerRound) {
                $this->msg = array(
                    'text' => 'You have an active game, you cannot change the seconds per Round during an active game!',
                    'type' => 'INFO'
                );
                $this->secondsPerRound = $this->SysMan->Session->secondsPerRound;
            }
            if($this->roundsPerGame != $this->SysMan->Session->roundsPerGame) {
                $this->msg = array(
                    'text' => 'You have an active game, you cannot change the rounds per game during an active game!',
                    'type' => 'INFO'
                );
                $this->roundsPerGame = $this->SysMan->Session->roundsPerGame;
            }
        }

        // If player signed-in, establish rounds according to DB data
        if($this->SysMan->Session->signInState == Common_Models_SysMan::SIGNED_IN){
            // round information is derived, it is not set during construction
            $roundModel = new WordShuffle_Model_Game_Round(array(
                'idGame' => $this->id
            ));
            $rounds = $roundModel->findAll();
            if(count($rounds) > 0){
                foreach($rounds as $round) {
                    $this->Rounds = new WordShuffle_Model_Game_Round($round);
                }
            }
            else{
                // do nothing, the postSave method will save round data which will implement an insert operation
            }
        }

    }

    protected function setIdPlayer(){
        // ignore, idPlayer only derives from session variables
    }
    protected function getIdPlayer(){
        return $this->SysMan->Session->idPlayer;
    }

    protected function setRound(){
        // not allowed
        throw new Exception("WordShuffle_Model_Game->setRound() not allowed");
    }
    protected function getRound(){
        return $this->SysMan->Session->round;
    }

    private $_secondsPerRound = 0;
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
        if($this->_secondsPerRound == 0){
            return $this->SysMan->Session->secondsPerRound;
        }else{
            return $this->_secondsPerRound;
        }
    }

    private $_roundsPerGame = 0;
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
        if($this->_secondsPerRound == 0){
            return $this->SysMan->Session->roundsPerGame;
        }else{
            return $this->_roundsPerGame;
        }
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
//        $this->_end = $x;
        $this->SysMan->Session->gameEnd = $x;
    }
    protected function getEnd(){
//        return $this->_end;
        return $this->SysMan->Session->gameEnd;
    }

    protected function setRounds($x){
        if($x instanceof WordShuffle_Model_Game_Round){
            // add new round into array of rounds if it is a Round object
            $this->_Rounds[$x->index] = $x;
        }elseif(is_array($x)) {
            if(count($x) == 0){
                // initializing Rounds
                $this->_Rounds = null;
            }
            elseif($this->roundsPerGame != 0 && count($x) == $this->SysMan->Session->roundsPerGame){
                // if each element is a Round object simply set the value
                $index = 0;
                foreach($x as $round){

                    if($round instanceof WordShuffle_Model_Game_Round){
                        // make sure idGame agrees with session
                        if($this->SysMan->Session->idGame == $round->idGame){
                            $this->_Rounds[] = $round;
                        }else{
                            // ignore disagreement and set rounds to NULL, postSave will reestablish with database, any new info is lost
                            $this->_Rounds = null;
                            break;
                        }
                    }else{
                        $this->_Rounds[] = new WordShuffle_Model_Game_Round($round);
                        $this->_Rounds[$index]->index = $index;
                    }
                    $index++;
                }
            }else{
                // disagreement with configuration and attempted set of Rounds, set rounds to NULL, postSave will reestablish with DB
                $this->_Rounds = null;
            }

        }else{
            throw new Exception(
                'Attempt to add an object to Game->Rounds that was not a WordShuffle_Model_Game_Round object'
            );
        }

        // update game points by triggering getter
        $this->getPoints();

    }
    protected function getRounds(){
        if($this->_Rounds == null){
            // get Round information from Session storage
            $this->_Rounds = array();
            // instantiate round object, it will bind with session variable
            for($i=0;$i<$this->roundsPerGame;$i++){
                $this->_Rounds[] = new WordShuffle_Model_Game_Round(
                    array(
                        'index'=>$i,
                        'time'=>$this->secondsPerRound
                    )
                );
            }
        }
        return $this->_Rounds;
    }

    protected function setPoints($x){
        $this->_points = $x;
    }
    protected function getPoints(){
        $this->_points = 0;
        $rounds = $this->Rounds;
        $count = count($rounds);

        // TODO: fix, round count reaches 1 with current round set at 2
        for($i=0;$i<$count;$i++){
            $this->_points = $this->_points + $rounds[$i]->points;
        }

        return $this->_points;
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
                $this->_Squares = $this->_initializeSquares();
                $this->_writeSquaresToSession();
            }
        }
        return $this->_Squares;
    }

    protected function setState($value){
        $options = array(self::NEW_GAME,self::NEW_ROUND,self::IN_PROGRESS,self::COMPLETED,self::ABANDONED);
        if(in_array($value,$options)){
            $this->SysMan->Session->gameState = (string) $value;
        }else{
            throw new Exception($this->className.'->setState to disallowed value = '.$value);
        }
    }
    protected function getState(){
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

    protected function setScoreBoard($x){
        $this->SysMan->Session->scoreBoard = $x;

        // update game points, getter will execute
        $this->getPoints();
    }
    protected function getScoreBoard(){
        return $this->SysMan->Session->scoreBoard;
    }

    private $_newGame = false;
    protected function setNewGame($value){
        $this->_newGame = (boolean) $value;
    }
    protected function getNewGame(){
        return $this->_newGame;
    }

    private $_newRound = false;
    protected function setNewRound($value){
        $this->_newRound = (boolean) $value;
    }
    protected function getNewRound(){
        return $this->_newRound;
    }

    // todo: move property docblock to top of class
    /**
     * @property    int         timeRemaining        - time remaining for active round
     */
    protected function setTimeRemaining(){
        // no setter
        throw new Exception('WordShuffle_Models_Game->setTimeRemaining() not allowed for this property');
    }
    protected function getTimeRemaining(){
        if($this->_Rounds != null && $this->round > 0){
            $diff = strtotime($this->Rounds[$this->round-1]->end) - time();
        }else{
            $diff = 0;
        }
        return (int) $diff;
    }


    /**
     * Process game state after execution of find.  Updates game state if abandoned.
     *
     * @public
     * @return boolean
     */
    public function _postFind()
    {
        // update game state as appropriate
        $this->_processState();
        return true;
    }

    /**
     * logic prior to update or insert into database
     *
     * @public
     * @return  boolean
     */
    public function _preSave()
    {
        // todo: define method
        $this->_processState();
        return true;
    }

    /*
     * New Game object requires creation of the associated Round objects that will be used during the Game
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     *
     */
    protected function _preInsert(){
        // this is a new game or an anonymous game
        return true;
    }

    /*
     * New Game object requires creation of the associated Round objects that will be used during the Game
     *
     * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     */
    protected function _preUpdate(){

        return true;
    }

    protected function _postSave(){
        $session = $this->SysMan->Session;

        // If player signed-in, establish rounds according to DB data
        if($this->SysMan->Session->signInState == Common_Models_SysMan::SIGNED_IN){
            // set the session variable idPlayer to the results of the save operation
            $session->idGame = $this->id;
            // save each round
            foreach($this->Rounds as $round) {
                $round->idGame = $this->id;
                $round->save();
            }
        }
    }

//    public function start(){
//        $this->start = date('Y-m-d H:i:s');
//        $this->save();
//    }

    /**
     * Checks word for validity and scores as appropriate.
     *
     * @return array    - associative array with keys success, msg, scoreBoard, roundPoints, gamePoints, and gameState
     */
    public function submitWord(){
        $msg = 'Submit Failed!';
        $success = true;

        // only process game state if game is active
        if($this->state && $this->state != self::COMPLETED && $this->state != self::ABANDONED){
            // process game state to trigger state transition as appropriate
            $this->_processState();
        }

        /*
         * User can only submit a word when the game is active.  Game.save() events will toggle the game state to
         * NEW_ROUND or COMPLETED when appropriate.  Submissions only occur during IN_PROGRESS.
         */
        if($this->newRound){
            $msg = "New Round!";
        }
        else if($this->newGame){
            $this->msg = array(
                "type" => 'INFO',
                "text" => "Software glitch, submission of word should not happen during new game!"
            );
        }
        else if($this->state == self::IN_PROGRESS){
            // validate word with board layout
            if(count($this->wordSquares) < 2){
                $success = false;
                $msg = 'Word too short!';
            }else{
                // validate the word derived from the current board configuration
                $word = '';
                foreach($this->wordSquares as $square){
                    $word = $word.$square->letter;
                    // check the letter with the board stored in session
                    if($this->SysMan->Session->Squares[$square->row-1][$square->col-1]['Letter'] !== $square->letter){
                        $success = false;
                        $msg = 'Board Mismatch';
                    }
                }
                if($word !== $this->word){
                    $success = false;
                    $msg = 'Board Mismatch';
                }
            }

            // check current word list and see if it exists
            foreach($this->scoreBoard as $entry){
                if($this->word == $entry['word']){
                    $msg = 'Duplicate';
                    $success = false;
                }
            }

            // look for word
            if($success){
                $success = $this->Mapper->findWord($this->word);
                if($success){
                    $msg = 'Success!';
                    $this->_scoreWord($this->word);
                    // update game points
                    $this->getPoints();
                    // save current round, if session authenticated
                    if($this->SysMan->Session->signInState == Common_Models_SysMan::SIGNED_IN){
                        $this->Rounds[$this->round-1]->save();
                    }
                }else{
                    $msg = 'Rejected!';
                }
            }
        }else{
            $success = false;
            $msg = 'Game Over!';
        }

        $return = array(
            'success'=> $success,
            'msg'=> $msg,
            'scoreBoard'=> $this->scoreBoard,
            'roundPoints'=> $this->Rounds[$this->round-1]->points,
            'gamePoints'=> $this->points,
            'gameState'=> $this->state,
            'newRound'=> $this->newRound
        );

        return $return;
    }

    /**
     * Quit current game
     *
     * @public
     */
    public function quit()
    {
        $this->state = self::ABANDONED;
        $this->save();
    }

    protected function _validateModel(){
        // todo: validate game state
        $success = true;

        return $success;
    }

    /**
     * Validate model before a save operation. Called before Mapper::Save()
     *
     * @return  bool    True    on valid data
     */
    protected function _validateSave(){
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
    /**
     * Generates a random letter based on frequency distribution of letters
     *
     * @private
     * @return string
     */
    private function _randomLetter()
    {
        // create map for relative frequency of the letters in the English language, ref http://en.wikipedia.org/wiki/Letter_frequency
        $map = array(
            'A' => 8.167,       // frequency of A = 8.167%
            'B' => 1.482,
            'C' => 2.782,
            'D' => 4.253,
            'E' => 12.702,
            'F' => 2.228,
            'G' => 2.015,
            'H' => 6.094,
            'I' => 6.966,
            'J' => 0.153,
            'K' => 0.772,
            'L' => 4.025,
            'M' => 2.406,
            'N' => 6.749,
            'O' => 7.507,
            'P' => 1.929,
            'Q' => 0.095,
            'R' => 5.987,
            'S' => 6.327,
            'T' => 9.056,
            'U' => 2.758,
            'V' => 0.978,
            'W' => 2.361,
            'X' => 0.150,
            'Y' => 1.974,
            'Z' => 0.074
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

        // update the round points
        $round = $this->Rounds[$this->round-1];
        $round->points = $round->points + $score;
        $round->wordCount++;

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

    /**
     * Process current game state and advance to next state as appropriate
     *
     * @private
     */
    private function _processState()
    {
        $this->SysMan->Logger->info('START Game->_processState; current state = '.$this->state,$this->className);

        if($this->newGame && $this->state != self::IN_PROGRESS){
            $this->id = 0;
            $this->SysMan->Session->idGame = 0;
            $this->SysMan->Session->round = 1;
            $this->start = date("Y-m-d H:i:s");
            $this->points = 0;
            $this->roundAvg = 0;
            $this->scoreBoard = [];
            $this->word = '';
            $this->newGame = false; // reset new game flag since it will be processed here
            $this->state = self::IN_PROGRESS;
            foreach($this->Rounds as $round){
                $round->reset();
                $round->time = $this->secondsPerRound;
                if($round->index == 0){
                    $round->start = date('Y-m-d H:i:s');
                    $round->end = date('Y-m-d H:i:s',strtotime("+{$this->secondsPerRound} seconds"));
                }
            }

            $this->Mapper->abandonUncompletedGames();

            // initialize game squares for sending to front end
            foreach ($this->Squares as $row) {
                foreach ($row as $square) {
                    $square->letter = $this->_randomLetter();
                }
            }
            $this->_writeSquaresToSession();

            $this->newRound = true; // set new round flag so that frontend starts the clock
        }
        elseif($this->state == self::IN_PROGRESS){
            $time = time();
            $diff = $time - strtotime($this->Rounds[$this->round-1]->end);
            // call round ended if within one second of end time.
            $roundEnded = $diff >= -1;
            $gameEnded = $roundEnded && ($this->round == $this->roundsPerGame);

            // check if user trying to start a new game with one in-progress
            if($this->newGame){
                // active game in progress, set the id to the value stored in session and return for processing by frontend
                $this->id = $this->SysMan->Session->idGame;
                $this->newGame = false;
            }

            if($gameEnded){
                $this->state = self::COMPLETED;
                $this->end = date('Y-m-d H:i:s');
            }elseif($roundEnded){
                $this->SysMan->Logger->info('Game->_processState determines round ended during state '.$this->state,$this->className);
                // save current round to DB
                $this->Rounds[$this->round-1]->save();
                $this->newRound = true;
                $this->SysMan->Session->round++;
                $this->scoreBoard = [];
                $round = $this->Rounds[$this->round-1];
                $round->start = date('Y-m-d H:i:s');
                $round->end = date('Y-m-d H:i:s',strtotime("+{$this->secondsPerRound} seconds"));
                // save new round to DB
                $this->Rounds[$this->round-1]->save();

                // initialize game squares for sending to front end
                foreach ($this->Squares as $row) {
                    foreach ($row as $square) {
                        $square->letter = $this->_randomLetter();
                    }
                }
                $this->_writeSquaresToSession();
            }else{
                // nothing
            }
        }

        $this->SysMan->Logger->info('END Game->_processState new state = '.$this->state,$this->className);

    }

}