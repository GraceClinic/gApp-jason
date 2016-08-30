<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 11/9/14
 * Time: 4:23 PM
 */
/**
 * Session class
 *
 * @package Utility
 * @since   0.1
 * @property string     msg             Non-critical, informative message to display to the user;
 * @property int        idPlayer        *SESSION* Session stored UserID
 * @property int        idGame          *SESSION* Session stored ModifiedByID
 * @property string     playerName      *SESSION* Session stored player name
 * @property int        roundsPerGame   *SESSION* Session stored rounds per Game configured by the user
 * @property int        secondsPerRound *SESSION* stored seconds per round
 * @property int        idChallenge     *SESSION* primary key indexing challenge question
 * @property    int             signInState     - tracks the current sign-in state of the player
 * @property    array           Squares         - game squares for active round
 * @property    datetime        gameStart       - time stamp for start of new Game
 * @property    datetime        gameEnd         - time stamp for end of game
 * @property    string          gameState       - current state of game
 * @property    array   Rounds          - game rounds
 * @property    int     roundAvg        - average points per round
 * @property    int     points          - game points
 * @property    array   scoreBoard      - array of scores for the current game
 * @property    int     round           - current game round
 * @property    int         acceptedTOS        determines login, registration or anonymous play
 */
class Common_Models_Session
{

    /**
     * @var Common_Models_Session   $Session
     */
    private static $Session = null;

    private
        /** @var Zend_Session_Namespace _Session session cookie data */
        $_oldSignInState,
        $_logger;   /** @var Zend_Log Handle to Zend logging object*/

    public function __construct()
    {
        $this->_logger = Zend_Registry::get('logger');


        // initialize the session round object if it is currently empty
        if(count(self::$Session->Rounds) == 0){
            $this->_initRounds();
        }

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
        if (method_exists($this, $method)) {
            return $this->$method($value);
        } else { // else choose error handler. Throw Exception, Log it, or message user
            throw new Exception("No Setter defined for ".$name.".");
        }
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

    /**
     * Converts the class to string
     *
     * @return string
     */
    public function __toString()
    {
        return
            '....       Session  Data       .... ' . PHP_EOL .
            'idPlayer:     ' . $this->idPlayer . PHP_EOL .
            'playerName:     ' . $this->playerName . PHP_EOL .
            'idChallenge:     ' . $this->idChallenge . PHP_EOL .
            'roundsPerGame:     ' . $this->roundsPerGame . PHP_EOL .
            'secondsPerRound:     ' . $this->secondsPerRound . PHP_EOL .
            'idGame:       ' . $this->idGame . PHP_EOL .
            'signInState:     ' . $this->signInState . PHP_EOL .
            'Msg:          ' . $this->msg . PHP_EOL.
            'acceptedTOS    ' . $this->acceptedTOS . PHP_EOL;
    }

    protected function setIdPlayer($x)
    {
        self::$Session->idPlayer = (integer) $x;

        return $this;
    }
    protected function getIdPlayer()
    {
        return self::$Session->idPlayer;
    }
    protected function setPlayerName($x)
    {
        self::$Session->playerName = (string) $x;

        return $this;
    }
    protected function getPlayerName()
    {
        return self::$Session->playerName;
    }
    protected function setIdChallenge($x)
    {
        self::$Session->idChallenge = $x;

        return $this;
    }
    protected function getIdChallenge()
    {
        return self::$Session->idChallenge;
    }
    protected function setRound($value){
        self::$Session->round = (int) $value;
    }
    protected function getRound(){
        return self::$Session->round;
    }

    protected function setRoundsPerGame($x)
    {
        $x = (int) $x;
        $isNew = $x != self::$Session->roundsPerGame;
        self::$Session->roundsPerGame = $x;

        if($isNew){
            // initialize array of Rounds per new setting
            $this->_initRounds();
        }

        return $this;
    }
    protected function getRoundsPerGame()
    {
        return self::$Session->roundsPerGame;
    }
    protected function setSecondsPerRound($x)
    {
        $x = (int) $x;
        $isNew = $x != self::$Session->secondsPerRound;
        self::$Session->secondsPerRound = $x;

        if($isNew){
            // initialize array of Rounds per new setting
            $this->_initRounds();
        }

        return $this;
    }
    protected function getSecondsPerRound()
    {
        return self::$Session->secondsPerRound;
    }
    protected function setIdGame($x)
    {
        self::$Session->idGame = (integer) $x;

        return $this;
    }
    protected function getIdGame()
    {
        return self::$Session->idGame;
    }
    protected function setGameStart($x)
    {
        self::$Session->gameStart = $x;

        return $this;
    }
    protected function getGameStart()
    {
        return self::$Session->gameStart;
    }
    protected function setGameEnd($x)
    {
        self::$Session->gameEnd = $x;

        return $this;
    }
    protected function getGameEnd()
    {
        return self::$Session->gameEnd;
    }
    protected function setGameState($x)
    {
        self::$Session->gameState = $x;

        if(self::$Session->gameState == WordShuffle_Model_Game::NEW_GAME){
            $this->_initRounds();
        }

        return $this;
    }
    protected function getGameState()
    {
        return self::$Session->gameState;
    }
    protected function setSignInState($state){
        if($state !== $this->_oldSignInState){
            $this->_oldSignInState = self::$Session->signInState;
            self::$Session->signInState = (int) $state;
        }
    }
    protected function getSignInState(){
        return (int) self::$Session->signInState;
    }
    protected function setSquares($value){
        self::$Session->Squares = $value;
    }
    protected function getSquares(){
        return self::$Session->Squares;
    }
    protected function setScoreBoard($value){
        // assume associative array with keys (word, points)
        if($value && is_array($value)){
            // place the new word at the beginning of the array
            array_unshift(self::$Session->scoreBoard,$value);
        }else{
            self::$Session->scoreBoard = [];
        }
    }
    protected function getScoreBoard(){
        return self::$Session->scoreBoard;
    }

    protected function setRounds($value){

        self::$Session->Rounds = $value;
    }
    protected function getRounds(){
        return self::$Session->Rounds;
    }
    protected function setMsg($msg)
    {
        //Append to the message field
        if ($msg) {
            self::$Session->msg .= (string) $msg . '\n';
        }

        return $this;
    }
    protected function getMsg()
    {
        $msg = self::$Session->msg;
//        //Reset the message field
//        self::$Session->msg = "";
        return $msg;
    }

    private $_acceptedTOS = 0;
    protected function setacceptedTOS($value){
        self::$Session->acceptedTOS = $value;
    }
    protected function getacceptedTOS(){
        return self::$Session->acceptedTOS;
    }


    /**
     * @param int   $i  - round index
     * @param string    $field  - round field name
     * @param mixed     $value  - value to set field
     */
    public function updateRound($i,$field,$value){
        //$rounds = self::$Session->Rounds;
        self::$Session->Rounds[$i][$field] = $value;
    }

    public function toArray(){
        $sqLetters = '';
        foreach($this->Squares as $row){
            foreach($row as $square){
                $sqLetters = $sqLetters.$square['Letter'];
            }
        }
        $ret = Array(
            'idPlayer'=>    $this->idPlayer,
            'idChallenge'=> $this->idChallenge,
            'roundsPerGame'=>   $this->roundsPerGame,
            'secondsPerRound'=> $this->secondsPerRound,
            'idGame'=>  $this->idGame,
            'signInState'=> $this->signInState,
            'round'=> $this->round,
            'Squares'=>  $sqLetters,
            'Rounds'=>  $this->Rounds,
            'Msg'=> $this->msg,
            'acceptedTOS' => $this->acceptedTOS
        );

        return $ret;
    }

    private function _initRounds(){
        $rounds = array();
        for($i=0;$i<$this->roundsPerGame;$i++) {
            array_push(
                $rounds,
                array(
                    'index'=>$i,
                    'idGame' => $this->idGame,
                    'time' => $this->secondsPerRound,
                    'points' => 0,
                    'wordCount' => 0,
                    'start' => null,
                    'end' => null
                )
            );
        }
        $this->Rounds = $rounds;
    }

    /**
     * Initialize new session name space
     *
     * @public
     * @return object
     */
    public static function initSession()
    {
        self::$Session = new Zend_Session_Namespace('gapp');

        // if user identified, maintain session variables, otherwise initialize session variables
        if (!isset(self::$Session->idPlayer)) {
            // stuff
            self::$Session->idGame = 0;
            self::$Session->idPlayer = 0;
            self::$Session->playerName = '';
            self::$Session->idChallenge = 0;
            self::$Session->roundsPerGame = 3;
            self::$Session->secondsPerRound = 120;
            self::$Session->round = 0;
//            self::$Session->start = null;
//            self::$Session->end = null;
            self::$Session->points = 0;
            self::$Session->roundAvg = 0;
            self::$Session->signInState = 0;
            self::$Session->Rounds = Array();
            self::$Session->Squares = Array();
            self::$Session->gameStart = null;
            self::$Session->gameEnd = null;
            self::$Session->gameState = null;
            self::$Session->scoreBoard = Array();
            self::$Session->acceptedTOS = 0;
        }

        return self::$Session;

    }
}