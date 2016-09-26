/**
 * WordShuffle_Controllers_Play Class
 *
 * This controller provides the mechanisms for interaction with an active game.
 *
 * @extends {App_Common_Abstracts_ActionController}
 *
 * Dependency injections:
 * @param   {object}        $scope      - local angular scope for this controller
 * @param   {function}      $controller - angular controller service responsible for instantiating controllers
 * @param   {function}      $state      - ui.router state service for URL routing control
 * @param   {WordShuffle_Models_Game}   Game        - singleton Game object, only one game active per player
 * @param   {WordShuffle_Models_Player} Player      - singleton Player object, only one player across controllers
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
 * @property    Game
 * The active Game object.  The controller provides access to this object in support of playing the WordShuffle
 * game.
 *
 * @type        WordShuffle_Models_Game
 * @public
 **/

/**
 * ACTION METHODS
 **/
/**
 * @method   indexAction
 * Provides logic associated with index action.  When triggered, this action will get the current Player information
 * through execution of Player.find() and get the current Game information with Game.find().  Upon return of the Game
 * information, it will redirect to the Play controller's play action if the Game.state is active (i.e not 'undefined'
 * or COMPLETED or ABANDONED).

 * @public
 */
/**
 * @method   playAction
 * Provides logic associated with play action.  When triggered, this action will evaluate the current Game state based
 * on the following:
 *
 * 1) If Game.newGame flagged, the controller will update the Game properties roundsPerGame, secondsPerRound, and
 * idPlayer with the comparable properties from the Player object (roundsPerGame, secondsPerRound, and id).  It will
 * then set the Game.state to IN_PROGRESS and execute a Game.save operation to the backend.  Finally, it will reset the
 * Game.newGame flag.
 * 2) If the Game.stat is ABANDONED, COMPLETED, or 'undefined' it will redirect to the Play controller's index action.
 * 3) Otherwise, it will implement a Game.find() action and update the SysMan.msg with an INFO message "Please finish
 * your active game!".  Once the find() operation returns, the Game.Clock must update with the information returned to
 * Game.timeRemaining.

 * @public
 */

/**
 * PUBLIC METHODS
 */
/**
 * @method   start
 * Supports start of new game with current configuration.  If the current action is "index", the controller sets the
 * Game.NewGame flag and routes to the "play" action to handle playing game.  Otherwise, if the Game.status is READY,
 * the controller sets the Game.NewGame flag and executes a Game.save action to start a new game.  If the Game.status
 * is any other value, alert the user that a game is in progress.
 *
 * @public
 * @return   {bool}
 */
/**
 * @method   quit
 * Quit the active game through initiation of the Game.quit action.  Upon successful return from the backend, route to
 * the controller's "index" action.
 *
 * Simple method that flips the value of the showSecret flag.  Services the "show secret" control for Player's whose
 * signInState is SIGNED_IN.
 *
 * @public
 */

/******************
 * PROTECTED METHODS
 ******************/
/**
 * @method   _onClose
 * Nothing required.
 *
 * @protected
 * @param    newState   {{module:string,controller:string,action:string}}    The state replacing current state
 */