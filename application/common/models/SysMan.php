<?php
/**
 * SysMan.php
 *
 * @copyright GRACE HOLDINGS LLC.
 * @License GRACE HOLDINGS LLC.
 *
 * GRACE HOLDINGS LLC. CONFIDENTIAL
 */
/**
 * Class Common_Models_SysMan is a singleton instance class for the purpose of messaging between models and monitoring
 * general application health.
 *
 * @package Common_Models
 * @property array                  Msg     Messages recorded by Controller and Model objects, setter expects array with keys identifying "text", "code", and "type"
 * @property Common_Models_Logger   Logger     Instance of the Utility Logger class
 * @property object                 state   Current state of the application (module, controller, action)
 * @property Common_Models_Session  Session Session object storing session information, used for persistence of information
 */
final class Common_Models_SysMan
{
    /**
     * Single-instance accessor for SysMan
     * Use this method to find the instance of SysMan
     * eg: Common_Models_SysMan::getInstance() and then chain any needed functions.
     *
     * @return Common_Models_SysMan
     */
    public static function getInstance()
    {
        // Using Singleton Pattern, limit creation of SysMan to only one instance
        static $instance = null;

        if (!$instance instanceof Common_Models_SysMan) {
            $instance = new Common_Models_SysMan();
            $instance->_Logger      = new Common_Models_Logger(Common_Models_Logger::DEBUG);
            $instance->_Session     = new Common_Models_Session();
        }

        return $instance;
    }

    const ANONYMOUS_PLAY = 0;
    const NAME_PENDING = 1;
    const NEW_SIGN_IN = 5;
    const SECRET_PENDING = 10;
    const SIGNED_IN = 20;

    private
        $_Session,
        $_msg = array(),
        $_Logger,
        $_error,
        $_errNo,
        $_errMsg,
        $_state;

    /*
     * Private constructor insures that application cannot construct this object outside the getInstance() function
     * which insures the singleton instance.
     */
    private function __construct()
    {
        // maintain single instance
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
            '...................................' . PHP_EOL .
            '....       SysMan Status       ....' . PHP_EOL .
            '...................................' . PHP_EOL .
            'ErrNo:  ' . $this->_errNo . PHP_EOL .
            'ErrMsg: ' . $this->_errMsg . PHP_EOL .
            $this->Session .
            '...................................';
    }

    /*****************************
     * Class Getters and Setters
     ****************************/
    protected function setLogger()
    {
        throw new Exception('Attempt to set Common_Models_SysMan->Logger not allowed');
    }
    protected function getLogger()
    {
        return $this->_Logger;
    }

    protected function setError()
    {
        throw new Exception('Attempt to set Common_Models_SysMan->error not allowed.  Property set automatically when recording an ERROR type message with SysMan->addMsg()');
    }
    protected function getError()
    {
        return $this->_error;
    }

    protected function setErrNo()
    {
        throw new Exception('Attempt to set Common_Models_SysMan->errNo not allowed.  Property set automatically when recording an ERROR type message with SysMan->addMsg()');
    }
    protected function getErrNo()
    {
        return $this->_errNo;
    }

    protected function setErrMsg()
    {
        throw new Exception('Attempt to set Common_Models_SysMan->errMsg not allowed.  Property set automatically when recording an ERROR type message with SysMan->addMsg()');
    }
    protected function getErrMsg()
    {
        return $this->_errMsg;
    }

    protected function setSession()
    {
        throw new Exception('Attempt set Common_Models_SysMan->Session not allowed');
    }
    protected function getSession()
    {
        return $this->_Session;
    }

    /*
     * Setter for msg property
     *
     * @param   array   associative array with keys identifying "text", "code", "type" necessary to build Common_Models_Msg object
     */
    protected function setMsg($msg){

        // assume over-write of current message array
        if(is_array($msg)){
            $this->_msg = $msg;
        }
        // assume clearing message array
        else if($msg == ''){
            $this->_msg = array();
        }
        // else add entry to existing message array
        else{
            $this->_msg[] = $msg;
        }

    }
    protected function getMsg(){
        $msg = $this->_msg;

        // clear the message array after reading, this insures that messages are only acted upon once
        $this->_msg = array();
        return $msg;
    }

    protected function setState($state){
//        $this->Logger->info('SysMan->setState = '.print_r($state,true));
        foreach($state as $key => $value){
            if (!in_array($key,array('module','controller','action'))){
                $msg = 'Attempt to set SysMan.state to non-compliant value.  Expected '.
                    'value must be an associative array with keys = "module", "controller", and "action".  '.
                    'Instead, the value was the following:  '.implode('; ',array_keys($state));
                throw new Exception($msg);
            }
        }

        $this->_state = $state;

    }
    protected function getState(){
        return $this->_state;
    }

    /**
     * Initialize new session name space
     *
     * @public
     * @return object
     */
    public static function initSession()
    {
        Zend_Session::start();

        $session = new Zend_Session_Namespace('gapp');

        // if user identified, maintain session variables, otherwise initialize session variables
        if (!isset($session->idPlayer)) {
            // stuff
            $session->idGame = 0;
            $session->idPlayer = 0;
            $session->playerName = '';
            $session->idChallenge = 0;
            $session->roundsPerGame = 3;
            $session->secondsPerRound = 120;
            $session->start = null;
            $session->end = null;
            $session->points = 0;
            $session->roundAvg = 0;
            $session->signInState = 0;
            $session->Rounds = Array();
            $session->Squares = Array();
            $session->wordList = Array();
            $session->gameStart = null;
            $session->gameEnd = null;
            $session->gameState = null;
            $session->scoreBoard = Array();
        }

        return $session;

    }




}