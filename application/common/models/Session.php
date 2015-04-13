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
 * @property    int         signInState        - tracks the current sign-in state of the player
 * @property    array         Squares          - game squares for active round
 */
class Common_Models_Session
{

    private
        /** @var Zend_Session_Namespace _Session session cookie data */
        $_Session,
        $_oldSignInState;

    public function __construct()
    {
        $this->_Session = Zend_Registry::get('session');
//        $this->_Session = new Zend_Session_Namespace();
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
            'Msg:          ' . $this->msg . PHP_EOL;
    }

    protected function setIdPlayer($x)
    {
        $this->_Session->idPlayer = (integer) $x;

        return $this;
    }
    protected function getIdPlayer()
    {
        return $this->_Session->idPlayer;
    }
    protected function setPlayerName($x)
    {
        $this->_Session->playerName = (string) $x;

        return $this;
    }
    protected function getPlayerName()
    {
        return $this->_Session->playerName;
    }
    protected function setIdChallenge($x)
    {
        $this->_Session->idChallenge = $x;

        return $this;
    }
    protected function getIdChallenge()
    {
        return $this->_Session->idChallenge;
    }
    protected function setRoundsPerGame($x)
    {
        $this->_Session->roundsPerGame = (integer) $x;

        return $this;
    }
    protected function getRoundsPerGame()
    {
        return $this->_Session->roundsPerGame;
    }
    protected function setSecondsPerRound($x)
    {
        $this->_Session->secondsPerRound = (integer) $x;

        return $this;
    }
    protected function getSecondsPerRound()
    {
        return $this->_Session->secondsPerRound;
    }
    protected function setIdGame($x)
    {
        $this->_Session->idGame = (integer) $x;

        return $this;
    }
    protected function getIdGame()
    {
        return $this->_Session->idGame;
    }
    protected function setSignInState($state){
        if($state !== $this->_oldSignInState){
            $this->_oldSignInState = $this->_Session->signInState;
            $this->_Session->signInState = (int) $state;
        }
    }
    protected function getSignInState(){
        return (int) $this->_Session->signInState;
    }
    protected function setSquares($value){
        $this->_Session->Squares = $value;
    }
    protected function getSquares(){
        return $this->_Session->Squares;
    }
    protected function setRounds($value){
        $this->_Session->Rounds = $value;
    }
    protected function getRounds(){
        return $this->_Session->Rounds;
    }
    protected function setMsg($msg)
    {
        //Append to the message field
        if ($msg) {
            $this->_Session->msg .= (string) $msg . '\n';
        }

        return $this;
    }
    protected function getMsg()
    {
        $msg = $this->_Session->msg;
        //Reset the message field
        $this->_Session->msg = "";

        return $msg;
    }

    public function toArray(){
        $ret = Array(
            'idPlayer'=>    $this->idPlayer,
            'idChallenge'=> $this->idChallenge,
            'roundsPerGame'=>   $this->roundsPerGame,
            'secondsPerRound'=> $this->secondsPerRound,
            'idGame'=>  $this->idGame,
            'signInState'=> $this->signInState,
            'Squares'=>  $this->Squares,
            'Rounds'=>  $this->Rounds,
            'Msg'=> $this->msg
        );

        return $ret;
}

}