/**
 * WordShuffle_Models_Player
 *
 * The Player object controls authentication and the WordShuffle default game settings.
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {WordShuffle_Models_Player}       - Singleton instance of the Player object
 *
 * Dependency injections:
 * @param {App_Common_Abstracts_Model}              Model      The abstract superclass
 */

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    name
 * Player's name.  The setter for this property monitors if new value is different than previous value.  Given a new
 * value, setter sets "saveIsPending" and clears the "secret" property.  Any change to this value must also validate
 * player "signInState" as described in the DETAILED SPECIFICATIONS below.
 *
 * @type    string
 * @public
 */
/**
 * @property    secret
 * Answer to challenge question
 *
 * @type        string
 * @public
 **/
/**
 * @property    signInState
 * Flags if user requires login versus playing anonymously.  The backend API closely controls this property.  The value
 * only proxies what is stored within the session variable "signInState".  The backend API does not allow for setting
 * this property to SIGNED_IN.  This only happens through the login() method, in which case the method will directly
 * set the session variable "signInState" to SIGNED_IN when the user successfully authenticates.  This is to stop URL
 * mangling at the frontend side in an attempt to bypass the login process.
 *
 * @type        boolean
 * @public
 **/
/**
 * @property    defaultName
 * Identifies default name for anonymous users.  The backend API provides this information.  Setting of this property
 * is not allowed.
 *
 * @type        string
 * @public
 **/
/**
 * @property    challenges
 * Challenge question choices provided by the backend API as read from the database.  Setting of this property is
 * not allowed.
 *
 * @type        array
 * @public
 **/
/**
 * @property    idChallenge
 * The primary key for the challenge question selected by the Player.  When set and Player.save executed, the backend
 * API uses this value to store the new challenge question for the Player.
 *
 * @type        int
 * @public
 **/
/**
 * @property    challenge
 * Challenge question selected by the Player as read from the database.  This question displays to the user as an
 * authentication challenge if the backend determines that the Player.name exists within the database.  If the
 * frontend sets this value, it will not matter to the backend.  The backend only uses idChallenge to determine the
 * value for this property.
 *
 * @type        string
 * @public
 **/
/**
 * @property    secondsPerRound
 * Total time in a complete round.  If the user does not have a currently active game, the backend grabs this value from
 * the last game completed by the player.  When the Player starts a new game, this information configures that game.
 *
 * @type        int
 * @public
 **/
/**
 * @property    roundsPerGame
 * Number of rounds in a complete game.  If the user does not have a currently active game, the backend grabs this
 * value from the last game completed by the player.  When the Player starts a new game, this information configures
 * that game.
 *
 * @type        int
 * @public
 **/
/**
 * @property    saveIsPending
 * Flags if Player object requires save.
 *
 * @type        boolean
 * @public
 **/

/**
 * PUBLIC METHODS
 */
/**
 * @method   logout
 *
 * Resets player flags and then sends logout request.  This request could be implemented as a "relay" method.
 * Instead, this method uses the model's "remove()" method to preform this action, since Players are never
 * removed.  The backend destroys the session information and returns boolean flag indicating success.
 * Given success, method creates a new INFO type "msg" declaring "Player logout successful".  Also, The "name"
 * property returns to the "defaultName" and "id" sets to 0.  This method must return the promise resulting from
 * the logout request (remove() method) for processing by any controller as appropriate.
 *
 * @public
 * @return   {promise}
 */

/**
 * RELAY METHODS
 */
/**
 * @method   login
 *
 * Submits request to login with Player name.  From the frontend prospective, it will relay this request to the
 * backend only when the Player.signInState is not ANONYMOUS_PLAY.  Before submitting the relay request to the
 * backend, the method clears the Player.msg array.  This will ready the property for population by the backend
 * based on the results of the login.  From the backend prospective, the following occurs on login request based
 * on value of Player.signInState:
 *
 * 1) If NAME_PENDING, executes a find for all players with Player.name.
 *      a) If it does not exist, method sets Player.signInState to NEW_SIGN_IN and Player.msg as type SUCCESS with
 *      text "Good news!  The user name is available, please pick your secret question to secure your new user!".
 *      b) If there is one hit, method sets Player properties to the resulting hit and Player.signInState to
 *      SECRET_PENDING and Player.msg as type SUCCESS with text "Welcome back! Please answer your secret question to
 *      start playing!".  Method must also set the session variable "idPlayer" to the id in the result for future use
 *      in validating the secret.
 *      c) If there is more than one hit, method throws exception.
 * 2) If NEW_SIGN_IN, executes a find for all players with Player.name.
 *      a) If no hits, it creates a new Player record in the database and sets "id" to the resulting primary key,
 *      as well as the session variable "idPlayer" storing that information.
 *          i) If the record creation is successful, method sets Player.msg as type SUCCESS with text "Your new player
 *          is ready to go!  Configure your defaults and start playing!".
 *          ii) If unsuccessful, method sets Player.msg as type DANGER with text "Failed to save player information
 *          for some reason.".
*       b) If the find reveals one hit, method sets Player attributes based on hit, the session variable "idPlayer"
 *       accordingly, Player signInState to SECRET_PENDING and Player.msg as type SUCCESS with text "Welcome back!
 *       Please answer your secret question to start playing!".
 *      c) If there is more than one hit, method throws exception.
 * 3) If SECRET_PENDING, method validates if secret matches with that stored in the database against the user with
 * Player.id.
 *      a) Given a match, method set Player.msg as type SUCCESS with text "Secret accepted!  You are ready for play!".
 *      Method proceeds to set session variable "signInState" as SIGNED_IN.
 *      b) Given no match, method sets Player.msg as type DANGER with text "Secret rejected!  Please try again!"
 *
 *  Method only returns TRUE is action results in toggle of session "signInState" to SIGNED_IN.
 *
 * @public
 * @return   {boolean}
 */
/**
 * @method  _postLogin
 *
 * Runs logic after login() method returns from backend.  Clears secret field.
 *
 * @protected
 */

/**
 * PROTECTED METHODS
 */
/**
 * @method   _postSave
 *
 * Logic executed after Player.save returns.  If signInState is SIGNED_IN, clears the secret property.  Returns
 * true when successful.
 *
 * @protected
 * @return   {boolean}
 */
/**
 * @method   _preDispatch
 *
 * Logic to apply before any dispatch to the backend.  Clears the msg array in preparation for receipt of any
 * new messages that may result from the pending request to the backend API.
 *
 * @public
 * @return   {boolean}
 */
/**
 * @method   _postDispatch
 *
 * Logic to apply after any dispatch to the backend.  Clears secret property after return of any request.
 * Returns true if successful.
 *
 * @public
 * @return   {boolean}
 */

/**
 * DETAILED SPECIFICATION
 *
 * This model works in concert with the backend API to manage player authentication and game defaults.
 * The API root is "/WordShuffle/Player/".  Since the backend drives the properties "defaultName" and
 * "challenges", the object constructor excludes these properties from requests sent to the backend API.
 * The backend side explicitly sets the Player.id to the value stored in the session variable "idPlayer".
 * The backend login process drives setting of this session variable as appropriate.  On construction of
 * this object from the backend standpoint, the Player.id always sets to the value stored in the session
 * "idPlayer" variable.
 *
 * The Player object maintains "signInState" to manage proper behavior.  The SysMan object provides the
 * constants for this state.  The values and descriptions follow:
 *
 * ANONYMOUS_PLAY:  Player not authenticated with application, but can play game anonymously.  In this state,
 * game results not saved to database.  In this case, data associated with current game saved to session
 * variables for display to user.
 * NAME_PENDING:    Player.name changed and needs to be validated with database.  If it exists, player presented
 * with secret question for authentication.  If it does not exist, player can secure name for use by picking
 * secret question and setting answer.
 * NEW_SIGN_IN:     Player.name identified as available, awaiting user to select secret question and answer.
 * SECRET_PENDING:  Player.name identified as existing in database, awaiting user to answer secret question to use.
 * SIGNED_IN:       Player successfully authenticated with database by answering secret question correctly.
 *
 * The Player object tracks certain events and determines the "signInState".  From the frontend standpoint,
 * the following occurs when user changes Player.name:
 *
 * 1) If ANONYMOUS_PLAY and Player.name is new but not set to "defaultName", set signInState as NAME_PENDING
 * 2) If NAME_PENDING and name is "defaultName", set signInState as ANONYMOUS_PLAY
 * 3) If NEW_SIGN_IN or SECRET_PENDING and Player.name is new but not set to "defaultName", set signInState to
 * NAME_PENDING.
 * 4) If SIGNED_IN, player can do as he likes, backend will determine if new name is already taken.
 * 5) Otherwise, set to ANONYMOUS_PLAY.
 *
 * From the backend standpoint, refer to Player.login() description for processing of "signInState".
 *
 *
 *
 **/

