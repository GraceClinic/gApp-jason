(function () {
    /**
     * Model factory for providing the superclass for all application models
     *
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger singleton
     * @param {object}  $state      - reference to AngularJS state object
     * @param {function(new:App_Common_Models_Tools_Timer)}   Timer   - reference to Timer constructor
     * @param {function}  $http     - reference to AngularJS http object
     * @param {function(new:App_Common_Models_Message(data))|App_Common_Models_Message}   Message - message constructor
     * @returns {App_Common_Models_SysMan}
     */
    function App_Common_Models_SysManFactory(Logger,$state,Timer,$http,Message) {
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
            /**
             * @property    App_Common_Models_SysMan#Logger      - reference to Logger singleton for logging messages
             * @type        App_Common_Models_Tools_Logger
             * @public
             **/
            Object.defineProperty(self,'Logger',{get: getLog,set: setLog});
            function getLog(){
                return Logger;
            }
            function setLog(){
                Logger.entry('SysMan.Log.set() NOT ALLOWED!  Why did you do it?',self.constructor.name,Logger.ERROR,Logger.ERRNO.APP_ERROR);
            }
            /**
             * @property    App_Common_Models_SysMan#error      - flags application error
             * @type        bool
             * @public
             **/
            //Object.defineProperty(self,'error',{get: getError,set: setError});
            //var _error = false;
            //function getError(){
            //    return _error;
            //}
            //function setError(inError){
            //    if(inError){
            //    }
            //
            //    _error = inError;
            //}
            ///**
            // * @property    App_Common_Models_SysMan#errNo      - records associate error number for reference
            // * @type        int
            // * @public
            // **/
            //Object.defineProperty(self,'errNo',{get: getErrNo,set: setErrNo});
            //var _errNo = 0;
            //function getErrNo(){
            //    return _errNo;
            //}
            //function setErrNo(value){
            //    _errNo = value;
            //}
            /**
             * If msg property set to string value, type assumed as INFO
             *
             * @property    App_Common_Models_SysMan#msg      - array of message objects with keys 'text' and 'type'
             * @type        {App_Common_Models_Message|App_Common_Models_Message[]|object|object[]}
             * @public
             **/
            Object.defineProperty(self,'msg',{get: getMsg,set: setMsg,enumerable:true});
            var _msg = [];
            function getMsg(){
                return _msg;
            }
            function setMsg(x){
                // assume over-write of current message array
                //if(x !== null){
                //    if(Array.isArray(x) && x.length > 0){
                //        _msg = x;
                //    }
                //    // assume clearing message array
                //    else if(x == ''){
                //        _msg = [];
                //    }
                //    // else add entry to existing message array
                //    else if(typeof x === "object" && "text" in x && "type" in x){
                //        _msg.push(x);
                //    }
                //    else if(typeof x === 'string'){
                //        // assume type is INFO
                //        _msg.push({text:x,type:self.Logger.TYPE.INFO});
                //    }
                //    else if(x.length == 0){
                //        // do nothing
                //    }
                //    else{
                //        self.Logger.entry('SysMan.setMsg() called with improper argument',self.constructor.name,self.Logger.TYPE.WARNING);
                //    }
                //}
                if(typeof x === 'App_Common_Models_Message'){
                    _msg.push(x);
                }
                else if(Array.isArray(x) && x.length > 0){
                    // must be an array of Message objects
                    if(typeof x === 'App_Common_Models_Message'){
                        _msg = x;
                    }else{
                        this.Logger.entry(
                            self.constructor.name + 'setMsg() value incorrect',
                            'App_Common_Models_SysMan',
                            this.Logger.TYPE.ERROR
                        )
                    }
                }
                // assume clearing message array, null is also considered object and/or array
                else if(Array.isArray(x) && x.length == 0){
                    _msg = [];
                }
                // else object passed representing Message object
                else if(typeof x === 'object'){
                    x = new Message(x);
                    _msg.push(x);
                }
                else{
                    // nothing
                }
            }


            /**
             * @property    App_Common_Models_SysMan#Timer      - application wide timer
             * @type        App_Common_Models_Tools_Timer
             * @public
             **/
            Object.defineProperty(self,'Timer',{get: getTimer,set: setTimer});
            var _Timer = new Timer;
            function getTimer(){
                return _Timer;
            }
            function setTimer(value){
                _Timer = value;
            }
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
            var _state = {'module':'undefined','controller':'undefined','action':'undefined'};
            function getState(){
                return _state;
            }
            function setState(value){
                // log changes to "state" for debug purposes
                for(var $key in value){
                    if(!$key in ['module','controller','action']){
                        var _err = 'APP ERROR:  Attempt to set App.state to non-compliant value.  Expected ' +
                            'value must be an associative array with keys = "module", "controller", and "action".  ' +
                            'Error occurred during application state = ' + JSON.stringify(self.state);
                        Logger.entry(_err,'App.state.set()',Logger.TYPE.ERROR,Logger.ERRNO.APP_ERROR);
                        //self.error = true;
                    }else{
                        //noinspection JSUnfilteredForInLoop
                        _state[$key] = value[$key];
                    }
                }
            }

            /*****************************************
             * Public Methods declaration / definition
             *****************************************/
            /**
             * Set allowed properties from data array passed as parameter
             *
             * @method   setFromArray
             * @public
             * @param    {array}        data        - properties to set
             * @return   {boolean}
             */
            //self.setFromArray = function(data){
            //    console.log('SysMan.setFromArray; data = ',data);
            //    var _allowed = ['msg','error','errNo','state'];
            //    // set properties per argument passed during construction
            //    for(var $key in data){
            //        //noinspection JSUnfilteredForInLoop
            //        if(_allowed.indexOf($key)){
            //            // use self reference in order to execute setter method, call using bracket notation within object scope
            //            //noinspection JSUnfilteredForInLoop
            //            self[$key] = data[$key];
            //        }else{
            //            // check for lower case version of property
            //            //noinspection JSUnfilteredForInLoop
            //            if(_allowed.indexOf(_lcFirst($key))){
            //                //noinspection JSUnfilteredForInLoop
            //                self[_lcFirst($key)] = data[$key];
            //            }
            //        }
            //    }
            //};
            ///**
            // * restart the application
            // *
            // * @method   restart
            // * @public
            // */
            self.restart = function(){
                $state.go('module.controller.action',{"module":"wordshuffle","controller":"welcome","action":"index"});
                //$window.location.reload();
            };

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
                    module:       self.state.module,
                    controller:   'error',
                    action:       'error'
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
                        function() {
                            $state.go('module.controller.action',_newState);
                        },
                        function() {
                            var _warn = 'You did not define an Error controller/action for your module = ' +
                                self.state.module + '.';
                            Logger.entry(_warn,'SysMan._routeToError()',Logger.TYPE.WARNING);
                            _newState = {
                                module: 'main',
                                controller: 'error',
                                action: 'error'
                                };
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
            Logger.entry('START App_Common_Models_SysMan.construct()',self.constructor.name);
            Logger.mode = Logger.MODE.DEBUG;          // output all log entries
            Logger.output = Logger.OUTPUT.CONSOLE;    // set output to console
            self.Timer.trip = 1000;                    // timer trips every second unless another resource changes it

            // register _routeError with Logger so that it will trigger SysMan to service the error
            Logger.callOnError(_routeError.bind(self));

            Logger.entry('END App_Common_Models_SysMan.construct()',self.constructor.name);

            // most models return itself for daisy chaining
            return self;
        }

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        Object.defineProperty(App_Common_Models_SysMan.prototype,"ANONYMOUS_PLAY",{value: 0, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NAME_PENDING",{value: 1, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NAME_PENDING_REGISTER",{value: 2, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NAME_PENDING_LOGIN",{value: 3, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"NEW_SIGN_IN",{value: 5, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SECRET_PENDING",{value: 10, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SIGNED_IN",{value: 20, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"ANONYMOUS_STATE",{value: 1, writable: false}); // todo: remove this
        Object.defineProperty(App_Common_Models_SysMan.prototype,"REGISTER_STATE",{value: 2, writable: false}); // todo: remove this
        Object.defineProperty(App_Common_Models_SysMan.prototype,"LOGIN_STATE",{value: 3, writable: false}); // todo: remove this
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SIGNED_IN_EDITING",{value: 21, writable: false});
        Object.defineProperty(App_Common_Models_SysMan.prototype,"SIGNED_IN_EDIT_NOT_ALLOWED",{value: 22, writable: false});


        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new App_Common_Models_SysMan;
    }

    App_Common_Models_SysManFactory.$inject = [
        'App_Common_Models_Tools_Logger',
        '$state',
        'App_Common_Models_Tools_Timer',
        '$http',
        'App_Common_Models_Message'
    ];

    angular.module('App_Common').factory('App_Common_Models_SysMan', App_Common_Models_SysManFactory);
})();
