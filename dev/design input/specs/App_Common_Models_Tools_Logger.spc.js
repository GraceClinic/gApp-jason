/**
 * App_Common_Models_Tools_Logger Class
 *
 * The global Logger object for general troubleshooting and error handling
 *
 * @param dateFilter        (object)        Angularjs dateFilter object
 *
 * @returns {App_Common_Models_Tools_Logger}
 **/

/**
 * CONSTANTS
 * @constant    ERRNO       {object}        Object keyed as {NO_ERROR, APP_ERROR, CTRL_ERROR, CTRL_ACTION_ERROR,
 *                                          MODEL_ERROR, MODEL_SAVE_ERROR, and MODEL_GET_ERROR}, used as ErrNo input
 *                                          to calls against the "entry" method.
 * @constant    TYPE        {object}        Keyed as {INFO, WARNING, ERROR}, used as "type" input to calls against the
 *                                          "entry" method.
 * @constant    MODE        {object}        Keyed as {DEBUG, STRICT, NORMAL}, used as "mode" input when setting the
 *                                          "mode" property
 *
 */

/**
 * PROPERTIES
 * @property    inError     {boolean}       Flags if the application is in an error state
 * @property    stack       {date:date,source:string,type:int,errNo:int,text:string}
 *                                          An array of the last 30 messages recorded to the Logger, displays in default
 *                                          error handler to use for troubleshooting
 * @property    errMsg      {string}        Message associated with first event throwing app into error state
 * @property    mode        {int}           Logger mode as one of the class constants:  NORMAL, STRICT, or DEBUG
 *                                          NORMAL will only log messages of type ERROR, STRICT will log everything
 *                                          typed WARNING and above, and DEBUG will log everything typed INFO and above
 * @property    output      {string}        Directs log output to console or file with constants:  CONSOLE or FILE.
 *                                          Currently, only CONSOLE is operational.
 *
 **/

/**
 * METHODS
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 */
/**
 * @method  entry
 * Records a new entry to the log file.
 *
 * @public
 * @param   {string}  text            - message to log
 * @param   {string}  source          - origin of message, usually object full name (line number)
 * @param   {int}     [type]          - optional, one of the Logger type constants
 * @param   {int}     [errNo]         - optional, one of the Logger error number constants
 * @returns {boolean}
 */
/**
 * @method  callOnError
 * Allows SysMan to register a callback function to trigger after the occurrence of an error.  This allows communication
 * from the Logger class to the SysMan class without a circular dependency.
 *
 * @public
 * @param {function}    $callback       The function to execute on the occurrence of an Error type log entry
 */
