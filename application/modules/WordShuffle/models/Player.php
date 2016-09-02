<?php

/**
 * Maintains Player object
 *
 * @property    string      name                name chosen by the player
 * @property    int         roundsPerGame       - number of rounds in the game, taken from last game
 * @property    int         secondsPerRound     - seconds per round, taken from last game
 * @property    string      defaultName         - identifies the default name for the Player when not chosen
 * @property    string      secret              - answer to challenge
 * @property    int         idChallenge         - primary key indexing the challenge question
 * @property    datetime    createDate          date time current round started
 * @property    datetime    modifyDate          date time round will end
 * @property    int         signInState         - flags state of sign-in for display of needed information
 * @property    array       challenges          - the secret questions to secure player user
 * @property    string      actionState
 * @property WordShuffle_Model_Mapper_Player Mapper
 *
 */
class WordShuffle_Model_Player extends WordShuffle_Model_Abstract
{

    const WORD_SHUFFLE = 1;
    const MAX_ROUNDS = 5;
    const MAX_SECONDS_PER_ROUND = 180;
    const DEFAULT_NAME = 'Player';
    const NEW_LOGIN_MSG = "Good news!  The user name is available, please pick your secret question to secure your new user!";
    const WELCOME_BACK_MSG = "Welcome back!  Please answer your secret question to start playing!";
    const LOGIN_CREATED = "Your new player is ready to go!  Configure your defaults and start playing!";
    const LOGIN_SUCCESS = "Secret accepted!  You are ready for play!";
    const LOGIN_FAILURE = "Secret rejected!  Please try again!";
    const PLAYER_SAVE_ERROR = "Failed to save player information for some reason.";
    const PLAYER_NAME_EXIST = "Your new name is already in use, please pick another";
    const SAVE_SUCCESS = "Player save successful!";
    const MSG_SUCCESS = 'success';
    const MSG_WARNING = 'warning';
    const MSG_DANGER = 'danger';
    const ALREADY_REGISTERED_MSG = 'Sorry this username is already taken';
    const USER_NOT_FOUND_MSG = 'Sorry, the requested username is not found, go back to register';
    const ANON_PLAY_MSG = 'Playing anonymously';

    // variable serving class properties
    private
        $_nameChanged = false,
        $_createDate = null,
        $_modifyDate = null;

    /**
     * Initialize Game model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
        $this->SysMan->Logger->info('START WordShuffle_Model_Player.init()');
        // exclude instructions property from JSON array, frontend does not require
        $this->excludeFromJSON(array('modifyDate','createDate', 'secret'));

        // default createDate and modifyDate to now, this will be used during inserts and overwritten during updates
        $this->createDate = date('Y-m-d H:i:s');
        $this->modifyDate = date('Y-m-d H:i:s');

        // set the Player id to value stored in session variable, this will override any user attempt to mangle post information
        $this->id = $this->SysMan->Session->idPlayer;

        // initialize the session variable associated with the Player object if not defined yet
        if($this->SysMan->Session->playerName == ''){
            $this->SysMan->Session->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;
            $this->SysMan->Session->playerName = self::DEFAULT_NAME;
        }

        // validate that name change did not occur during sign-in process
        if($this->_nameChanged){
            $inProcessSignIn =
                $this->signInState > Common_Models_SysMan::ANONYMOUS_PLAY && $this->signInState < Common_Models_SysMan::SIGNED_IN && $this->signInState != Common_Models_SysMan::NAME_PENDING_REGISTER && $this->signInState != Common_Models_SysMan::NAME_PENDING_LOGIN;
            if($inProcessSignIn){
                // set the state back to name pending and erase the challenge question
                $this->signInState = Common_Models_SysMan::NAME_PENDING;
            }
        }
        $this->SysMan->Logger->info('END WordShuffle_Model_Player.init()');

    }

    // todo: move property docblock to top of class
    /**
     * @property    int         acceptedTOS        - terms of service
     */
    private $_acceptedTOS = 0;
    protected function setAcceptedTOS($value){
        $this->SysMan->Logger->info("this is the TOS value obtained" . $value);
        $value = $value ? 1 : 0;
        $this->_acceptedTOS = $value;
        $this->SysMan->Session->acceptedTOS = $value;
    }
    protected function getAcceptedTOS(){
        if (!$this->_acceptedTOS) {
            return $this->SysMan->Session->acceptedTOS;
        }
        return $this->_acceptedTOS;
    }


    private $_name = null;
    protected function setName($x){
        if($x !== null && $x !== '' && $this->SysMan->Session->playerName !== $x){
            $this->_name = (string) $x;
            // for anonymous play, the session object maintains memory of changes, once logged in, changes written to session after save
            if($this->signInState < Common_Models_SysMan::SIGNED_IN){
                $this->SysMan->Session->playerName = $this->_name;
            }
            $this->_nameChanged = true;
        }
    }
    protected function getName(){
        // set name to session variable if not yet defined
        if($this->_name == null){
            $this->_name = $this->SysMan->Session->playerName;
        }
        return $this->_name;
    }
    private $_secret = null;
    protected function setSecret($value){
        if($value !== ""){
            $this->_secret = (string) $value;
        }
    }
    protected function getSecret(){
        return $this->_secret;
    }
    protected function setIdChallenge($value){
        $this->SysMan->Logger->info('value of challenge = ' . $value);
        if(!empty($value)){
            $this->SysMan->Session->idChallenge = (int) $value;;
        }
    }
    protected function getIdChallenge(){
        return $this->SysMan->Session->idChallenge;
    }
    protected function setCreateDate($x){
        // TODO:  validate date argument
        $this->_createDate = $x;
    }
    protected function getCreateDate(){
        return $this->_createDate;
    }
    protected function setModifyDate(){
        // TODO:  validate date argument
        $this->_modifyDate = date('Y-m-d H:i:s');
    }
    protected function getModifyDate(){
        return $this->_modifyDate;
    }
    protected function setSignInState($state){
        // SIGNED_IN state only set through logon() method
        $this->SysMan->Logger->info('session signInState, state ' . $this->SysMan->Session->signInState . " " . $state);
        if($this->SysMan->Session->signInState < Common_Models_SysMan::SIGNED_IN && $state >= Common_Models_SysMan::SIGNED_IN){
            $this->msg = array(
                'type'=>self::MSG_DANGER,
                'text'=>'Player sign-in state does not validate with session state.  Setting state to session state.'
            );
            $this->SysMan->Session->signInState;
        }else{
            $this->SysMan->Session->signInState = (int) $state;
            $this->SysMan->Logger->info("signInSetter, session, model ". $this->SysMan->Session->signInState . "  " . "$this->signInState" );
        }
        $this->SysMan->Logger->info('session signInState, state ' . $this->SysMan->Session->signInState . " " . $state);
    }
    protected function getSignInState(){
        return $this->SysMan->Session->signInState;
    }
    protected function setDefaultName(){
        throw new Exception('WordShuffle_Models_Player setDefaultName not allowed!');
    }
    protected function getDefaultName(){
        return self::DEFAULT_NAME;
    }
    private $_challenges = null;
    protected function setChallenges($value){
        $this->_challenges = (array) $value;
    }
    protected function getChallenges(){
        if($this->_challenges == null){
            $this->_challenges = $this->Mapper->findChallenges();
        }
        return (array) $this->_challenges;
    }
    private $_secondsPerRound = null;
    protected function setSecondsPerRound($value){
        if((int) $value <= self::MAX_SECONDS_PER_ROUND && (int) $value > 0){
            $this->_secondsPerRound = (int) $value;
            // for anonymous play, the session object maintains memory of changes, once logged in, changes written to session after save
            if($this->signInState < Common_Models_SysMan::SIGNED_IN){
                $this->SysMan->Session->secondsPerRound = $this->_secondsPerRound;
            }
        }else{
            throw new Exception($this->className.' illegal set of seconds per round.');
        }
    }
    protected function getSecondsPerRound(){
        // set to session variable if not yet defined
        if($this->_secondsPerRound == 0){
            $this->_secondsPerRound = $this->SysMan->Session->secondsPerRound;
        }
        return $this->_secondsPerRound;
    }
    private $_roundsPerGame = null;
    protected function setRoundsPerGame($value){
        if((int) $value <= self::MAX_ROUNDS && (int) $value > 0){
            $this->_roundsPerGame = (int) $value;
            // for anonymous play, the session object maintains memory of changes, once logged in, changes written to session after save
            if($this->signInState < Common_Models_SysMan::SIGNED_IN){
                $this->SysMan->Session->roundsPerGame = $this->_roundsPerGame;
            }
        }else{
            throw new Exception($this->className.' illegal set of rounds per game.');
        }
    }
    protected function getRoundsPerGame(){
        // set name to session variable if not yet defined
        if($this->_roundsPerGame == 0){
            $this->_roundsPerGame = $this->SysMan->Session->roundsPerGame;
        }
        return $this->_roundsPerGame;
    }

    /** PUBLIC METHODS */
    /**
     * Find Player data based on model id or id parameter
     *
     * @param null $id
     * @return $this
     * @throws Exception
     */
    public function find($id = null){

        $signedIn = $this->signInState == Common_Models_SysMan::SIGNED_IN;

        // only execute find operation when signed-in, otherwise play is anonymous
        if($signedIn){
            parent::find($id);
        }

        return $this;
    }

    /**
     * Authenticate player
     *
     * @return bool|int
     * @throws Exception
     */
    public function login(){
        $success = false;
        $this->SysMan->Logger->info('Player->login(), signInState = '.$this->signInState);
        switch((int)$this->signInState){
            // get user's challenge information
            case Common_Models_SysMan::NAME_PENDING:
                $players = $this->Mapper->findAll();
                if(count($players) == 0){
                    $this->signInState = Common_Models_Sysman::NEW_SIGN_IN;
                    $this->msg = '';
//                    if ($this->actionState == "login") {
//                        $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::USER_NOT_FOUND_MSG);
//                        $success = false;
//                    }
//                    else if ($this->actionState == "register") {
//                        $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::NEW_LOGIN_MSG);
//                        $success = true;
//                    }

                    $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::NEW_LOGIN_MSG);
                    $success = true;
                }elseif(count($players) == 1){
                    $this->setFromArray($players[0]);;
                    $this->signInState = Common_Models_Sysman::SECRET_PENDING;
                    // set the idPlayer session variable, this location stores the true id which the Player model references
                    $this->SysMan->Session->idPlayer = $this->id;
                    $this->msg = '';
//                    if ($this->actionState == "login") {
//                        $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::WELCOME_BACK_MSG);
//                        $this->SysMan->Session->actionState = Common_Models_SysMan::LOGIN_STATE;
//                    }
//                    else if ($this->actionState == "register") {
//                        $this->msg = array('type'=>self::MSG_WARNING, 'text'=>self::ALREADY_REGISTERED_MSG);
//                        $this->SysMan->Session->actionState = Common_Models_SysMan::REGISTER_STATE;
//                    }
//                    $this->actionState = $this->SysMan->Session->actionState;
                    $success = true;
                }else{
                    throw new Exception(
                        'Query for players with name = '.$this->name.' resulted in multiple hits.  This is not expected.'
                    );
                }
                break;
            case Common_Models_SysMan::NAME_PENDING_REGISTER:
                $this->SysMan->Logger->info('inside name_pending_register case = '.$this->signInState);
                $players = $this->Mapper->findAll();
                if (count($players) == 0) {
                    $this->signInState = Common_Models_Sysman::NEW_SIGN_IN;
                    $this->SysMan->Logger->info('inside 0 players case = '.$this->signInState);
                    $this->msg = '';
                    $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::NEW_LOGIN_MSG);
                    $success = true;
                }
                else if (count($players) == 1) {
                    $this->msg = "";
                    $this->msg = array('type'=>self::MSG_WARNING, 'text'=>self::ALREADY_REGISTERED_MSG);
                    $this->signInState = Common_Models_SysMan::NAME_PENDING;
                    $success = false;
                }
                else {
                    throw new Exception(
                        'Query for players with name = '.$this->name.' resulted in multiple hits.  This is not expected.'
                    );
                }
                break;
            case Common_Models_SysMan::NAME_PENDING_LOGIN:
                $players = $this->Mapper->findAll();
                $this->SysMan->Logger->info('count players' . count($players));
                if (count($players) == 0) {
                    $this->msg = "";
                    $this->msg = array('type'=>self::MSG_WARNING, 'text'=>self::USER_NOT_FOUND_MSG);
                    $this->signInState = Common_Models_SysMan::NAME_PENDING;
                    $this->SysMan->Logger->info('signInState and sysman value' . $this->signInState . " " . Common_Models_SysMan::NAME_PENDING);
                }
                else if (count($players) == 1) {
                    $this->signInState = Common_Models_SysMan::SECRET_PENDING;
                    // set the idPlayer session variable, this location stores the true id which the Player model references
                    //$this->SysMan->Session->idPlayer = $this->id;
                    $this->setFromArray($players[0]);
                    $this->msg = '';
                    $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::WELCOME_BACK_MSG);
                    $success = true;
                }
                else{
                    throw new Exception(
                        'Query for players with name = '.$this->name.' resulted in multiple hits.  This is not expected.'
                    );
                }
                break;
            case Common_Models_SysMan::NEW_SIGN_IN:
                $players = $this->Mapper->findAll();

                if(count($players) == 0){
                    // run save at Mapper level to retrieve new primary key
                    $pk = $this->Mapper->save();
                    if($pk > 0){
                        // set the session variable for tracking player id
                        $this->SysMan->Session->idPlayer = $pk;
                        // setting signInState to SIGNED_IN only allowed through Session object
                        $this->SysMan->Session->signInState = Common_Models_Sysman::SIGNED_IN;
                        $this->msg = '';
                        $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::LOGIN_CREATED);
                    }else{
                        $this->msg = array('type'=>self::MSG_DANGER, 'text'=>self::PLAYER_SAVE_ERROR);
                    }
                }else {
                    throw new Exception(
                        'Query for players with name = ' . $this->name . 'Registering, resulted in one or multiple hits.  This is not expected.'
                    );
                }
                break;
            case Common_Models_SysMan::SECRET_PENDING:
                if($this->Mapper->secretIsValid()){
                    $this->msg = '';
                    $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::LOGIN_SUCCESS);
                    $success = true;
                    // setting signInState to SIGNED_IN only allowed through Session object
                    $this->SysMan->Session->signInState = Common_Models_Sysman::SIGNED_IN;
                    $this->SysMan->Session->idPlayer = $this->id;
                }else{
                    $this->msg = '';
                    //$this->SysMan->Session->signInState = Common_Models_Sysman::ANONYMOUS_PLAY;
//                    $this->SysMan->Session->idPlayer = 0;// check if this gives you an error, try logging In, with wrong password and then register a new user! check if player name overwritten or error thrown
//                    $this->SysMan->Session->idChallenge = 0;
//                    $this->SysMan->Session->playerName = " ";
                    //$this->logout();
                    $this->msg = array('type'=>self::MSG_DANGER, 'text'=>self::LOGIN_FAILURE);
                    $success = false;
                }

                break;
            case Common_Models_SysMan::SIGNED_IN:
                // treat this like a save event
                $this->save();
                break;
            case Common_Models_SysMan::SIGNED_IN_EDITING:
                $players = $this->Mapper->findAll();
                if (count($players) === 1 && $this->Mapper->secretIsValid() ) {
                    $this->signInState = Common_Models_SysMan::SIGNED_IN;
                }
                else $this->signInState = Common_Models_SysMan::SIGNED_IN_EDIT_NOT_ALLOWED;
                break;
            default:
                // todo: this should not happen,click session and revert back to Anonymous Play
        }

        return $success;
    }

    /**
     * Clears player session information
     *
     * @public
     */
    public function logout()
    {
        $this->SysMan->Logger->info('Execute logout, destroy session',$this->className);
        $this->name = $this->defaultName;
        $this->signInState = Common_Models_SysMan::ANONYMOUS_PLAY;
        $this->idChallenge = 0;
        $this->id = 0;

        Zend_Session::destroy(TRUE);

        return true;
    }

    /**
     * anonymousPlay
     *
     * @public
     * @return void
     */
    public function anonymousPlay()
    {
        $this->SysMan->Logger->info('starting anonymous function',$this->SysMan->Session);
    }


    public function save(){
        // if name changed during login process or after sign-in, check if name exist
        if($this->signInState > Common_Models_SysMan::NAME_PENDING && $this->_nameChanged && $this->Mapper->nameExists()){
            $this->msg = array('type'=>self::MSG_DANGER, 'text'=>self::PLAYER_NAME_EXIST);
        }else{
            if($this->signInState == Common_Models_Sysman::SIGNED_IN){
                $success = parent::save();
                if($success){
                    $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::SAVE_SUCCESS);
                }
            }else{
                // try to login with current data
                $this->login();
            }
        }
    }

    protected function _postSave(){
        $session = Common_Models_SysMan::getInstance()->Session;

        // check is idPlayer in session matches with player id
        if($session->idPlayer <> $this->id){
            throw new Exception('Session variable idPlayer does not match database records.');
        }

        // set the other session variables
        // session memory of idPlayer set during login action, not appropriate to set here
        $session->idChallenge = $this->idChallenge;
        $session->playerName = $this->name;
        $session->roundsPerGame = $this->roundsPerGame;
        $session->secondsPerRound = $this->secondsPerRound;
    }

    /**
     * Validates the result of a find operation to insure that it belongs to the requesting user and/or they are allowed
     * to see the results.
     *
     * @return bool
     */
    protected function _postFind(){
        // todo:  validate the find return to make sure user is allowed to read record
        switch($this->signInState){
            case Common_Models_Sysman::NEW_SIGN_IN:
                $this->msg = '';
                $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::NEW_LOGIN_MSG);
                break;
            case Common_Models_Sysman::SECRET_PENDING:
                $this->msg = '';
                $this->msg = array('type'=>self::MSG_SUCCESS, 'text'=>self::WELCOME_BACK_MSG);
                break;
            default:
                //nothing
        }
        return true;
    }

    /**
     * Compare current values with values saved in database, maintain database values as appropriate
     *
     * @return boolean
     */
    protected function _preUpdate()
    {
        $old = new WordShuffle_Model_Player($this->id);
        // maintain createDate in database
        $this->createDate = $old->createDate;

        // accept all other user changes

        return true;
    }

}