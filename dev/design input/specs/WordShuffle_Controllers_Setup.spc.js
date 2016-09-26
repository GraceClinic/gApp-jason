/**
 * WordShuffle_Controllers_Setup Class
 *
 * This controller provides a conduit for interaction with the Player model which holds the player's default game
 * configurations for play.
 *
 * @extends {App_Common_Abstracts_ActionController}
 *
 * Dependency injections:
 * @param   {object}        $scope      - local angular scope for this controller
 * @param   {function}      $controller - angular controller service responsible for instantiating controllers
 * @param   {function}      $state      - ui.router state service for URL routing control
 * @param   {WordShuffle_Models_Game}   Game        - singleton Game object, only one game active per player
 * @param   {WordShuffle_Models_Player} Player      - singleton Player object, only one player across controllers
 * @param   {App_Common_Models_Message} Message     - constructor for Message object
 */

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    Player
 * Simply returns the Player object passed to this controller as a dependency.  The controller makes this object
 * publicly available for use by the associated view templates.
 *
 * @type        WordShuffle_Models_Player
 * @public
 **/
/**
 * @property    showSecret
 * Controls hiding and showing secret fields when Player.signInState is SIGNED_IN.  If the Player.signInState is not
 * SIGNED_IN, the getter always resets this flag value to FALSE.
 *
 * @type        boolean
 * @public
 **/
/**
 * @property    minutesPerRound
 * Necessary to translate minutes to Player.secondsPerRound for proper display to the views.  When value set by
 * user input, the associated setter translates minutes to seconds and then saves to Player.secondsPerRound
 *
 * @type        int
 * @public
 **/

/**
 * ACTION METHODS
 **/
/**
 * @method   indexAction
 * User indexes the setup state
 *
 * Provides logic associated with index action.  When triggered, this action will get the current Player information
 * through execution of Player.find().  Also, if Game.state is in progress, it will redirect to the Play
 * controller's play action.

 * @public
 */

/**
 * PUBLIC METHODS
 */
/**
 * @method   playGame
 * Flags start of new game by setting Game.newGame and then routing to play action of the Play controller.  Validates
 * Player.saveIsPending and Player.signInState in conjunction with starting a new game.  If the Player.saveIsPending,
 * it executes Player.save().  If the Player.signInState is not SIGNED_IN and Player.saveIsPending, the controller
 * executes Player.login() to validate the player name as existing or new.
 *
 * @public
 * @return   {bool}
 */
/**
 * @method   toggleShowSecret
 * Toggles display of secret fields when the Player is signed-in
 *
 * Simple method that flips the value of the showSecret flag.  Services the "show secret" control for Player's whose
 * signInState is SIGNED_IN.
 *
 * @public
 */
/**
 * @method   savePlayer
 * Proxy Player.save() method.  Resets "showSecret" property before execution of save.
 *
 * @public                     - define scope
 */
/**
 * @method   playerLogout
 * Proxy Player.logout so controller can respond to successful logout.  On success, reload /Setup/index action
 * so that page can return to anonymous play configuration.
 *
 * @public
 */

/******************
 * PROTECTED METHODS
 ******************/
/**
 * @method   _onClose
 * Closure logic to implement on termination of the controller.  The ActionController superclass runs this
 * method against the current controller when the URL state transition dictates changing the controller.
 *
 * @protected
 * @param    newState   {{module:string,controller:string,action:string}}    The state replacing current state
 */
