(function(){
    // Shim layer with setTimeout fallback.  This allows interjection of repetitive processing
    // during browser screen refreshes (about 60 times per second), largely supporting animation
    window.requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    /**
     *
     * @param Timer
     * @param {App_Common_Models_Tools_Logger}    Logger
     * @returns {App}
     * @constructor
     */
    function AppFactory(Timer,Logger,$state){
        /**
         * Main application
         *
         * @class       App
         * @returns     {App}
         */
        function App(){
            var self = this;    // required to bypass scoping problem with parent superclass

            // private properties
            var _count = 0;     // counter for debug

            /*********************************
             * Public Properties declaration
             *********************************/
            /**
             * @property    Timer       - Application timer to synchronize events amongst controllers and models
             * @type        {App_Common_Models_Tools_Timer}
             */
            Object.defineProperty(self,"Timer",{get: getTimer,set: setTimer});
            /**
             * @property    {Object}    state           - current application state
             * @property    {string}    state.module    - currently active module
             * @property    {string}    state.controller    - currently active controller
             * @property    {string}    state.action        - currently active route action
             */
            Object.defineProperty(self,"state",{get: getState,set: setState});
            /**
             * @property    Log     - reference to global Logger class for use by Controllers and Models
             * @type        {App_Common_Models_Tools_Logger}
             */
            Object.defineProperty(self,"Log",{get: getLog});

            /********************************
             * GETTERS and SETTERS definition
             ********************************/
            var _Timer = new Timer;
            function getTimer(){
                return _Timer;
            }
            function setTimer(){
                console.log('App.Timer.set action not allowed!');
            }
            var _state = {'module':'undefined','controller':'undefined','action':'undefined'};
            function getState(){
                return _state;
            }
            function setState(value){
                var inError = false;
                for(var $key in value){
                    if(!$key in ['module','controller','action']){
                        var _msg = 'APP ERROR:  Attempt to set App.state to non-compliant value.  Expected ' +
                            'value must be an associative array with keys = "module", "controller", and "action".  ' +
                            'Error occurred during application state = ' + JSON.stringify(self.state);
                        Logger.Entry(_msg,'App.state.set()',Logger.TYPE.ERROR,Logger.ERRNO.APP_ERROR);
                        inError = setError();
                    }
                }
                if(!inError){
                    _state = value;
                    Logger.Entry('App state = ' + JSON.stringify(_state),'App');
                }
            }
            function getLog(){
                return Logger;
            }


            /************************
             * PRIVATE FUNCTIONS
             ************************/
            /**
             * Application ticker allowing periodic firing of specified functions, specifically the Controller.process
             * method that should dictate the periodic processing needs of a given controller.
             *
             * @function tick
             * @private
             * @returns {boolean}
             */
            function tick() {
                // maintain the ticker by requesting animation frames;
                requestAnimFrame(tick.bind(self));

                // Update repetitive functions per each trip of the timer
                if(self.Timer.isTripped){
                    // check for error state and reroute as appropriate
                    if(Logger.inError){
//                        routeToError();
//                        // reset the flag, so the App does not continuously route to the error controller
//                        Logger.inError = false;
                    }
                    // reset the trip flag after Controller completes processing
                    self.Timer.isTripped = false;
               }
//                if(_count % 1000 == 0){
//                    console.log('Tick');
//                    _count = 0;
//                }
//                _count++;

                return true;
            }

            /**
             * Routes to application error controller / error action
             *
             * @function
             * @private
             * @returns {boolean}
             */
            function routeToError(){
                var _newState = self.state;

                _newState.controller = 'error';
                _newState.action = 'error';

                // check to see if module has defined error controller / error action,
                // otherwise route to default App error controller
                $.ajax({
                    url:$state.get('module.controller.action').templateUrl(_newState),
                    type:'HEAD',
                    error: function(){
                        var _msg = 'You did not define an Error controller/action for your module = ' +
                            self.state.module + '.';
                        Logger.Entry(_msg,'App.routeToError()',Logger.TYPE.WARNING);
                        _newState.module = 'main';
                        $state.go('module.controller.action',_newState);
                    },
                    success: function(){
                        $state.go('module.controller.action',_newState);
                    }
                });

                return true;
            }

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            // Configure Logger and Timer
            Logger.mode = Logger.MODE.DEBUG;          // output all log entries
            Logger.output = Logger.OUTPUT.CONSOLE;    // set output to console
            self.Timer.trip = 100;                    // timer trips every 100 milliseconds

            Logger.Entry('Constructor START','App',Logger.TYPE.INFO);

            // load page extras when document is ready and start application ticker
            $(document).ready(function () {
                console.log('Document.Ready');
                //$('#Footer').load('app/html/footer.html');
                tick();    // start the app ticker
            });

            Logger.Entry('Constructor END','App',Logger.TYPE.INFO);

            return self;
        }

        return new App();
    }

    AppFactory.$inject = ['App_Common_Models_Tools_Timer','App_Common_Models_Tools_Logger','$state'];
    // Inject App object into the angular App module for access by other modules
    angular.module('App').factory('App',AppFactory);
})();