/**
 * WordShuffle_Controllers_Welcome Class
 *
 * Services the content associated with the Welcome tab.  Upon instantiation, the controller must post 2 new INFO type
 * messages to its "msg" property:
 *
 *      1) "Welcome to WordShuffle!"
 *      2) "Please read the instructions and learn more about this exciting game!"
 *
 * Both of these will post to the Banner directive bound within the WordShuffle_Views_Welcome template.
 *
 * @extends     {App_Common_Abstracts_ActionController}
 *
 * Dependency injections:
 * @param   {object}                    $scope      Local angular scope for this controller
 * @param   {function}                  $controller AngularJS service responsible for instantiating controllers
 * @param   {WordShuffle_Models_Game}   Game        Reference to the singleton Game object, only one game active per player
 * @param   {function(new:WordShuffle_Models_Instructions)|WordShuffle_Models_Instructions}
 *                                      Instructions    Constructor for game Instructions object
 * @param   {App_Common_Models_Message} Message         Constructor for Message object
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    Instructions
 * WordShuffle instructions
 *
 * @type        {WordShuffle_Models_Instructions}
 * @public
 */

/**
 * PUBLIC METHODS
 */
/**
 * @method indexAction
 * Provides logic associated with index action.  Currently, that means redirection to the "play" state if the user has
 * an active game.  This is the only reason that this controller requires the Game object passed as a dependency.
 *
 * @public
 **/

/**
 * DETAILED SPECIFICATION
 *
 * This controller services the "Welcome" tab of the application.  Once the specific controller template loads, it must
 * instantiate this controller.  That template will also bind the appCommonDirectivesBanner directive and pass its
 * "msg" property as input to the directive.  The specification for this template is found within the
 * WordShuffle_Views_Welcome.tpl.html page.
 *
 * The controller only supports one action:  index.  When the URL specifies this action, the controller will provide
 * information from the Instructions property as specified in the WordShuffle_Views_Welcome_Index.tpl.html wireframe
 * page.
 *
 **/
 