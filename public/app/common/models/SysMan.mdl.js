(function () {

    function App_Common_Models_SysManFactory(Logger,$state,Timer,$http) {
        /**
         * Singleton system state manager for the entire application.  Provides messaging across controllers and models.
         * Maintains access to Logger and controls error routing.  Also maintains global application timer for reference
         * by any resource requiring such.
         *
         * @class       App_Common_Models_SysMan
         * @returns     {App_Common_Models_SysMan}
         */
        function App_Common_Models_SysMan() {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /*******************
             * Private variables
             *******************/

            /********************************
             * Public Properties declarations
             ********************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    App_Common_Models_SysMan#Logger      - reference to Logger singleton for logging messages
             * @type        App_Common_Models_Tools_Logger
             * @public
             **/
            Object.defineProperty(self,'Logger',{get: getLog,set: setLog});
            /**
             * @property    App_Common_Models_SysMan#error      - flags application error
             * @type        bool
             * @public
             **/
            Object.defineProperty(self,'error',{get: getError,set: setError});
            /**
             * @property    App_Common_Models_SysMan#errNo      - records associate error number for reference
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'errNo',{get: getErrNo,set: setErrNo});
            /**
             * @property    App_Common_Models_SysMan#msg      - array of messages stored for reference by controller and/or models
             * @type        string[]
             * @public
             **/
            Object.defineProperty(self,'msg',{get: getMsg,set: setMsg});
            /**
             * @property    App_Common_Models_SysMan#Timer      - application wide timer
             * @type        App_Common_Models_Tools_Timer
             * @public
             **/
            Object.defineProperty(self,'Timer',{get: getTimer,set: setTimer});
            /**
             * Impromptu class allowing for documentation "state" property
             *
             * @class
             * @name        StateType
             * @property    {string}    module        - currently active module
             * @property    {string}    controller    - currently active controller
             * @property    {string}    action        - currently active route action
             *
             */
            /**
              * @property   App_Common_Models_SysMan#state      - current application state
              * @type       StateType|object
              * @public
              */
            Object.defineProperty(self,'state',{get: getState,set: setState});

            /*****************************************
             * Public Methods declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods
            /**
             * Set allowed properties from data array passed as parameter
             *
             * @method   setFromArray
             * @public
             * @param    {array}        data        - properties to set
             * @return   {boolean}
             */
            self.setFromArray = function(data){
                var _allowed = ['msg','error','errNo','state'];
                // set properties per argument passed during construction
                for(var $key in data){
                    // set property if it exists anywhere in prototype chain, hasOwnProperty only checks the object itself
                    if($key in _allowed){
                        // use self reference in order to execute setter method, call using bracket notation within object scope
                        self[$key] = data[$key];
                    }else{
                        // check for lower case version of property
                        if(_lcFirst($key) in _allowed){
                            self[_lcFirst($key)] = data[$key];
                        }
                    }
                }
            };

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            function getLog(){
                return Logger;
            }
            function setLog(value){
                Logger.entry('SysMan.Log.set() NOT ALLOWED!  Why did you do it?',self.constructor.name,Logger.ERROR,Logger.ERRNO.APP_ERROR);
            }
            var _error = false;
            function getError(){
                return _error;
            }
            function setError(inError){
                if(inError){
                }

                _error = inError;
            }
            var _errNo = 0;
            function getErrNo(){
                return _errNo;
            }
            function setErrNo(value){
                _errNo = value;
            }
            var _msg = [];
            function getMsg(){
                var msg = _msg;

                // clear the message array after reading
                _msg = [];
                return msg;
            }
            function setMsg(x){
                // assume over-write of current message array
                if(Array.isArray(x)){
                    _msg = x;
                }
                // assume clearing message array
                else if(x == ''){
                    _msg = [];
                }
                // else add entry to existing message array
                else{
                    _msg.push(x);
                }
            }
            var _Timer = new Timer;
            function getTimer(){
                return _Timer;
            }
            function setTimer(value){
                _Timer = value;
            }
            var _state = {'module':'undefined','controller':'undefined','action':'undefined'};
            function getState(){
                return _state;
            }
            function setState(value){
                // log changes to "state" for debug purposes
                self.Logger.entry('SetState() = ' + JSON.stringify(value),self.constructor.name);
                for(var $key in value){
                    if(!$key in ['module','controller','action']){
                        var _msg = 'APP ERROR:  Attempt to set App.state to non-compliant value.  Expected ' +
                            'value must be an associative array with keys = "module", "controller", and "action".  ' +
                            'Error occurred during application state = ' + JSON.stringify(self.state);
                        Logger.entry(_msg,'App.state.set()',Logger.TYPE.ERROR,Logger.ERRNO.APP_ERROR);
                        self.error = true;
                    }else{
                        _state[$key] = value[$key];
                    }
                }
            }

            /******************
             * Private functions
             *******************/
            /**
             * Upon recording of any error type message to SysMan, this function allows for routing to the error
             * controller.  It first will try a module specific error controller.  If not available, it will route
             * to the "Main" model error controller.
             *
             * @private
             */
            function _routeError(){
                var _newState = {
                    "module":       self.state.module,
                    "controller":   'error',
                    "action":       'error'
                };

                // route to error controller if not already there
                if(self.controller !== 'error'){
                    // check to see if module has defined error controller / error action,
                    // otherwise route to default App error controller
                    $http({
                        url:$state.get('module.controller.action').templateUrl(_newState),
                        method: "HEAD"
                    })
                        .then(
                        function(response) {
                            $state.go('module.controller.action',_newState);
                        },
                        function(errResponse) {
                            var _msg = 'You did not define an Error controller/action for your module = ' +
                                self.state.module + '.';
                            Logger.entry(_msg,'SysMan._routeToError()',Logger.TYPE.WARNING);
                            _newState.module = 'main';
                            $state.go('module.controller.action',_newState);
                            return $http.reject
                        }
                    );
                }


            }
            /**
             * Applies lower case to the initial letter of the string passed as a parameter
             *
             * @function    _lcFirst
             * @private
             * @param   {string}    x       - the string to apply lower case
             * @returns {string}            - the string with the initial letter in lower case
             */
            function _lcFirst(x){
                return x.charAt(0).toLowerCase() + x.slice(1);
            }
            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            Logger.mode = Logger.MODE.DEBUG;          // output all log entries
            Logger.output = Logger.OUTPUT.CONSOLE;    // set output to console
            self.Timer.trip = 1000;                    // timer trips every second unless another resource changes it

            // register _routeError with Logger so that it will trigger SysMan to service the error
            Logger.callOnError(_routeError.bind(self));

            Logger.entry('Constructor END',self.constructor.name,Logger.TYPE.INFO);

            // most models return itself for daisy chaining
            return self;
        }

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        Object.defineProperty(App_Common_Models_SysMan.prototype,"ANONYMOUS_PLAY",{value: 0, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NAME_PENDING",{value: 1, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NEW_SIGN_IN",{value: 5, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SECRET_PENDING",{value: 10, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SIGNED_IN",{value: 20, writable: false});

        /*****************************************
         * PROTOTYPE PUBLIC PROPERTIES DECLARATION
         *****************************************/
        // todo: use the "ng_pprop" live template to insert prototype properties

        /*************************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION/DEFINITION
         *************************************************/
        // todo: use the "ng_pmethod" live template to insert prototype methods

        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new App_Common_Models_SysMan;
    }

    // todo: inject dependenciesObject
    App_Common_Models_SysManFactory.$inject = ['App_Common_Models_Tools_Logger','$state','App_Common_Models_Tools_Timer','$http'];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App').factory('App_Common_Models_SysMan', App_Common_Models_SysManFactory);
})();
