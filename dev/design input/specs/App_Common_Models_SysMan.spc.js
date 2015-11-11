/**
 * App_Common_Models_SysMan Class
 *
 * State manager for the application.
 *
 * Dependency injections:
 * @param {object}                          $state      - reference to AngularJS state object
 * @param {function}                        $http       - reference to AngularJS http object
 * @param {App_Common_Models_Tools_Logger}  Logger      - reference to Logger singleton
 * @param {function(new:App_Common_Models_Tools_Timer)}   Timer   - reference to Timer constructor
 * @param {function(new:App_Common_Models_Message(data))|App_Common_Models_Message}   Message - message constructor
 *
 * @returns     {App_Common_Models_SysMan}
 *
 *
 **/

/**
 * CONSTANTS
 * @constant ANONYMOUS_PLAY     {int}   Flags user login state as anonymous; value is 0
 * @constant NAME_PENDING       {int}   Flags user login state as awaiting entry of name; value is 1
 * @constant NEW_SIGN_IN        {int}   Flags user login state as new registration; value is 5
 * @constant SECRET_PENDING     {int}   Flags user login state as user name identified, awaiting secret; value is 10
 * @constant SIGNED_IN          {int}   Flags user login state as authenticated; value is 20
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * PROPERTIES
 * @property    Logger
 * @property    msg         {App_Common_Models_Message[]}       Array of Message objects, if "msg" set to string value,
 *                                                              type assumed as INFO
 * @property    Timer       {App_Common_Models_Tools_Timer}     application wide timer
 * @property    state       {module:string,controller:string,action:string}
 *                                                              object representing current application state
 *
 **/
/**
 * @property    msg
 * Stores an array of messages for display and/or reference.  On set, it can accept a Message object or an array of such.  If
 * it is one object, the setters will add to the current array of Messages.  The value can also be set to an object
 * that is reflective of the Message object (meaning {{text: string, type: string}}).  The "type" value must be one of
 * the Message class constants:  TYPES.INFO, TYPES.SUCCESS, TYPES.WARNING, and TYPES.DANGER.
 *
 * @type        {App_Common_Models_Message|App_Common_Models_Message[]|object|object[]}
 * @public
 **/
/**
 * @property    Logger
 * Reference to singleton Logger instance for logging messages
 *
 * @type        {App_Common_Models_Tools_Logger}
 * @public
 **/

/**
 * DETAILED SPECIFICATION
 *
 * This is the general application state manager.  It is a singleton object referenced by every object extending the
 * Controller, Action Controller, or Model abstracts.  It provides means to log information for troubleshooting and / or
 * error capture.  Upon the recording of an error, it will route the application to the current module's error
 * controller.  If that does not exist, it routes the the Main controller's error controller / error action.  SysMan
 * maintains a "msg" property for sharing information between models and controllers.  It also holds a global application
 * timer for any synchronization requires between models, which may be required for animation.
 *
 * On the backend side, SysMan also maintains all of the session information and makes it available through the
 * "Session" property.  All manipulation of the session information MUST flow through SysMan.  No model nor controller
 * will make any direct modification of session information.  Maintaining this requirement provides one location to
 * manage session information.  Session information writes to the following location:
 *
 *      /data/session/
 *
 * When using SysMan.Logger to record log entries, the frontend writes these entries to the browser console object.
 * On the backend side, writes to this logger record within the following location:
 *
 *      /data/logs/application.log
 *
 *
 *
 **/


