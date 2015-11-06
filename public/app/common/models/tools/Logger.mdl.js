(function () {

    /**
     *
     * @param dateFilter        (object)        Angularjs dateFilter object
     *
     * @returns {App_Common_Models_Tools_Logger}
     */
    function App_Common_Models_Tools_LoggerFactory(dateFilter) {
        // private static variable for tracking error state
        var _inError = false;

        /**
         * The global Logger object for general troubleshooting and error handling
         *
         * @class       App_Common_Models_Tools_Logger
         * @returns     {App_Common_Models_Tools_Logger}
         */
        function App_Common_Models_Tools_Logger() {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /********************************
             * PUBLIC PROPERTIES declarations
             ********************************/
            /**
             * Impromptu class allowing for documentation of the "stack" property
             *
             * @class
             * @name        StackType
             * @property    {date}      date
             * @property    {string}    source
             * @property    {int}       type
             * @property    {int}       errNo
             * @property    {string}    text
             *
             */
            /**
             * @property    App_Common_Models_Tools_Logger#stack     - last stack entries as {"date","source","type","errNo","text"}
             * @type        StackType
             * @public
             */
            Object.defineProperty(self,"stack",{get: getStack,set: setStack});
            /**
             * @property    App_Common_Models_Tools_Logger#inError     - memory of error type log entry
             * @type        bool
             * @public
             */
            Object.defineProperty(self,"inError",{get: getInError,set: setInError});
            /**
             * @property    App_Common_Models_Tools_Logger#errMsg      - message associated with first event throwing app into error state
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'errMsg',{get: getErrMsg,set: setErrMsg});
            /**
             * @property    App_Common_Models_Tools_Logger#mode        - logger mode:  NORMAL, STRICT, or DEBUG
             * @type        int
             * @public
             */
            Object.defineProperty(self,"mode",{get: getMode,set: setMode});
            /**
             * @property    App_Common_Models_Tools_Logger#output      - designates destination of log output:  CONSOLE or FILE
             * @type        string
             * @public
             */
            Object.defineProperty(self,"output",{get: getOutput,set: setOutput});

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _stack = [];
            function getStack(){
                return _stack;
            }
            function setStack(value){
                var _stackFormat = ['date','source','type','text','errNo'];

                value.date = dateFilter(Date.now(),'M/d/yy h:mm:ss');
                for(var $key in value){
                    if(!$key in _stackFormat){
                        value = {
                            type:   self.TYPE.ERROR,
                            text:   'Attempted set of Logger.stack non-compliant format, expected {"date","source","type","text","errNo"}.  ' +
                                'Instead received the following:  ' + json.stringify(value),
                            errNo: self.ERRNO.APP_ERROR
                        };
                        self.inError = true;
                    }
                }
                if(_stack.length > 30){
                    // remove first element
                    _stack.shift();
                }
                // convert type to readable string
                switch(value.type){
                    case self.TYPE.ERROR:
                        value.type = 'ERROR';
                        break;
                    case self.TYPE.WARNING:
                        value.type = 'WARN';
                        break;
                    default:
                        value.type = 'INFO';
                }
                // add new element to end of array
                _stack.push(value)
            }

            function getInError(){
                return _inError;
            }
            function setInError(value){
                if(!_inError){
                    // clear error message
                    _errMsg = "";
                }
                _inError = value;
            }
            var _errMsg = "";
            function getErrMsg(){
                if(_errMsg == ""){
                    return "No error now, you just routed to the error page!";
                }else{
                    return _errMsg;
                }
            }
            function setErrMsg(value){
                console.log('Logger.setErrMsg = ',value);
                // maintain first error in message string, others will be in the stack output
                if(value && typeof value != 'undefined' &&_errMsg == ""){
                    _errMsg = value;
                }
            }
            var _mode = self.MODE.NORMAL;
            function getMode(){
                return _mode;
            }
            function setMode(value){
                _mode = value;
            }
            var _output = this.OUTPUT.CONSOLE;
            function getOutput(){
                return _output;
            }
            function setOutput(value){
                var _wrongValue = true;
                var _outputName = '';

                for(var key in self.OUTPUT){
                    if(value == self.OUTPUT[key]){
                        _wrongValue = false;
                        _outputName = key;
                    }
                }

                if(_wrongValue){
                    self.inError = true;
                    var _text = 'Logger.Output setter passed unexpected value = ' + value +
                        '.  Expected one of the Logger output constants';
                    var _source = 'App_Common_Models_Tools_Logger.setOutputTo()';
                    var _errNo = self.ERRNO.APP_ERROR;
                    var _type = self.TYPE.ERROR;
                    self.entry(_text,_source,_type,_errNo);
                }else{
                    _output = value;
                }
            }

            /*****************************************
             * PUBLIC METHODS declaration / definition
             *****************************************/
            /**
             * Allows SysMan to register a callback function to trigger after the occurrence of an error
             *
             * @param {function}    $callback
             */
            self.callOnError = function($callback){
                _runOnError = $callback;
            };

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/

            // most models return itself for daisy chaining
            return self;
        }

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        // error codes
        /**
         * Impromptu class allowing for documentation of the TYPE constant
         *
         * @class
         * @name        LoggerErrNo
         * @property    {int}   NO_ERROR
         * @property    {int}   APP_ERROR
         * @property    {int}   CTRL_ERROR
         * @property    {int}   CTRL_ACTION_ERROR
         * @property    {int}   MODEL_ERROR
         * @property    {int}   MODEL_SAVE_ERROR
         * @property    {int}   MODEL_GET_ERROR
         *
         */
        /**
         * @constant    App_Common_Models_Tools_Logger#ERRNO
         * @type        LoggerErrNo
         * @readonly
         */
        Object.defineProperty(App_Common_Models_Tools_Logger.prototype,"ERRNO",{
            value: {
                "NO_ERROR":0,
                "APP_ERROR":10,
                "CTRL_ERROR":20,
                "CTRL_ACTION_ERROR":30,
                "MODEL_ERROR":40,
                "MODEL_SAVE_ERROR":50,
                "MODEL_GET_ERROR":60
                },
            writable: false
            });
        /**
         * Impromptu class allowing for documentation of the TYPE constant
         * 
         * @class
         * @name        LoggerType
         * @property    {int}   INFO
         * @property    {int}   WARNING
         * @property    {int}   ERROR
         *
         */
        /**
         * @constant    App_Common_Models_Tools_Logger#TYPE
         * @type        LoggerType
         * @readonly
         */
        Object.defineProperty(App_Common_Models_Tools_Logger.prototype,"TYPE",{value: {"INFO":100,"WARNING":200,"ERROR":300}, writable: false});
        /**
         * Impromptu class allowing for documentation of the Logger MODE constant:  MODE.DEBUG will record all entry types,
         * MODE.STRICT records all but TYPE.INFO, and MODE.NORMAL only records TYPE.ERROR
         *
         * @class
         * @name        LoggerMode
         * @property    {int}   DEBUG
         * @property    {int}   STRICT
         * @property    {int}   NORMAL
         *
         */
        /**
         * @constant    App_Common_Models_Tools_Logger#MODE
         * @type        LoggerMode
         * @readonly
         */
        Object.defineProperty(App_Common_Models_Tools_Logger.prototype,"MODE",{value: {"DEBUG":301,"STRICT":201,"NORMAL":101}, writable: false});
        /**
         * Impromptu class allowing for documentation of the Logger OUTPUT constant.
         *
         * @class
         * @name        LoggerOutput
         * @property    {string}   CONSOLE  - directs output of log entries to console
         * @property    {string}   FILE     - directs output of log entries to a file
         *
         */
        /**
         * @constant    App_Common_Models_Tools_Logger#OUTPUT
         * @type        LoggerOutput
         * @readonly
         */
        Object.defineProperty(App_Common_Models_Tools_Logger.prototype,"OUTPUT",{value: {"CONSOLE":'Console',"FILE":'File'}, writable: false});

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION
         *****************************************/
        /**
         * Records a new entry to the log file.
         *
         * @method  Entry
         * @public
         * @param   {string}  text            - message to log
         * @param   {string}  source          - origin of message, usually object full name (line number)
         * @param   {int}     [type]          - optional, one of the Logger type constants
         * @param   {int}     [errNo]         - optional, one of the Logger error number constants
         * @returns {boolean}
         */
        App_Common_Models_Tools_Logger.prototype.entry = function (text, source, type, errNo){
            var _typeName = '';
            // errNo parameter is optional, set to zero if not defined
            errNo = errNo || 0;
            // type defaults to INFO
            type = type || this.TYPE.INFO;
            // set source as undefined if undefined
            source = source || 'undefined';

            var _typeNotRecognized = true;

            for(var key in this.TYPE){
                if(type == this.TYPE[key]){
                    _typeNotRecognized = false;
                    _typeName = key;
                }
            }

            if(_typeNotRecognized){
                _inError = true;
                text = 'Logger.entry() method passed unrecognized type element = ' + type +
                    '.  Expected one of the Logger type constants';
                errNo = this.ERRNO.APP_ERROR;
                type = this.TYPE.ERROR;
            }

            if(typeof text == 'undefined'){
                _inError = true;
                text = 'Logger.entry() method called with no text passed as parameter.';
                errNo = this.ERRNO.APP_ERROR;
                type = this.TYPE.ERROR;
            }

            // record errors to log file based on Logger.mode
            if(type < this.mode){
                if(this.output == this.OUTPUT.CONSOLE){
                    console.log(_typeName + ':  ' + text + ' (source = ' + source + ')');
                }else{
                    // todo:  write to log file
                }
            }else{
                // ignore
            }

            // set error flag if log entry is type ERROR
            if(type == this.TYPE.ERROR){
                this.errMsg = text;
                _runOnError();
            }

            // record to stack
            this.stack = {
                "source":   source,
                "type":     type,
                "errNo":    errNo,
                "text":     text
            };

            return !_inError;
        };

        /**
         * Shell function populating by SysMan with a callback when the Logger records an error
         *
         * @type function
         */
        function _runOnError(){}

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new App_Common_Models_Tools_Logger;
    }

    App_Common_Models_Tools_LoggerFactory.$inject = ['dateFilter'];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_Common').factory('App_Common_Models_Tools_Logger', App_Common_Models_Tools_LoggerFactory);
})();
