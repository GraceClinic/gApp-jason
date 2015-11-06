
(function () {

    function App_Common_Models_Tools_TimerFactory(){
        /**
         * @class       App_Common_Models_Tools_Timer
         * Timer for tracking and synchronizing events within the application
         *
         * @returns     {App_Common_Models_Tools_Timer}
         */
        function App_Common_Models_Tools_Timer(){
            var self = this;

            // private variables
            var _timeNow = Date.now();   // current date stamp
            var _timeThen = Date.now();  // previous date stamp when timer last accessed
            // error feedback

            /********************************
             * PUBLIC PROPERTIES declarations
             ********************************/
            /**
             * @property    trip
             * Milliseconds until timer trips
             *
             * @type        int
             * @public
             */
            Object.defineProperty(self,"trip",{get: getTrip,set: setTrip});
            /**
             * @property    App_Common_Models_Tools_Timer#isTripped   - Tracks when timer hits defined trip time
             * @type        boolean
             * @public
             */
            Object.defineProperty(self,"isTripped",{get: getIsTripped,set: setIsTripped});
            /**
             * @property    App_Common_Models_Tools_Timer#now         - Current timer count since start of timer
             * @type        int
             * @public
             */
            Object.defineProperty(self,"now",{get: getNow,set: setNow});
            /**
             * @property    App_Common_Models_Tools_Timer#delta       - Current count within the active trip window
             * @type        int
             * @public
             */
            Object.defineProperty(self,"delta",{get: getDelta});
            /**
             * @property    App_Common_Models_Tools_Timer#passedTrips - Number of trip windows passed since last trip
             * @type        int
             * @public
             */
            Object.defineProperty(self,"passedTrips",{get: getPassedTrips});

            /*****************************************
             * PUBLIC METHODS declaration / definition
             *****************************************/
            /**
             * Resets the timer to zero
             *
             * @method
             * @public
             * @returns {number}
             */
            self.reset = function(){
                _timeNow = Date.now();
                _delta = 0;
                _now = 0;
                _timeThen = Date.now();

                return _now;
            };
            /**
             * Todo:  Creates a reference point within the timer
             *
             * @method
             * @returns {int}       - returns the id associated with the mark for subsequent query by the caller
             */
            self.mark = function(){
                /* Stores timer value into an array.  Array continues to grow
                 based on calls to this function.
                 */

                return 0;
            };

            /**********************************
             * GETTERS AND SETTERS definitions
             *********************************/
            var _trip = 0;
            function getTrip() {
                return _trip;
            }
            function setTrip(x) {
                if(_isNumber(x)){
                    _trip = x;
                }else{
//                    self.App.State = self.App.Error;
//                    self.App.State.msg = 'Attempted to set Timer.trip to a non-numeric value.';
                }
            }
            var _isTripped = false;
            function getIsTripped() {
                // always update the Timer in order to determine isTripped
                _updateTimer();
                return _isTripped;
            }
            function setIsTripped(x){
                _isTripped = x;
                // update the timer, it may have tripped again
                _updateTimer();
            }
            var _now = 0;
            function getNow() {
                _updateTimer();
                return _now;
            }
            function setNow(x) {
                if(_isNumber(x)){
                    _delta = 0;
                    _now = x;
                    _timeThen = Date.now();
                }else{
//                    self.App.State = self.App.Error;
//                    self.App.State.msg = 'Attempted to set Timer.now to a non-numeric value.';
                }
            }
            var _delta = 0;
            function getDelta() {
                return _delta;
            }
            var _passedTrips;
            function getPassedTrips(){
                // Normally, expectation is that given a trip event, only one trip window has passed
                return _passedTrips;
            }
            // start constructor logic

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            /**
             * Determines if parameter is a number.
             *
             * @param {*}  n
             * @returns {boolean}
             * @private
             */
            function _isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            /**
             * Updates the timer based on now.  Determines if timer trip occurred and the number of associated trip
             * windows that passed since the last trip.
             *
             * @function
             * @private
             */
            function _updateTimer(){
                _timeNow = Date.now();
                var $dt = (_timeNow-_timeThen);

                _delta = _delta + $dt;        // accumulate delta time between trips, but not more than trip window
                _now = _now+_delta;           // accumulate total time since start of timer
                _timeThen = _timeNow;

                // record the number of trip windows passed since last reset
                _passedTrips = Math.floor(_delta / _trip);

                // determine if timer tripped
                if(_delta > _trip){
                    _isTripped = true;
                    _timeNow = Date.now();
                    // assign current value to the excess amount beyond tripping point,
                    // reset the accumulation to whatever is less than the trip window
                    _delta = _delta % _trip;
                    _timeThen = Date.now();
                }
            }

            return self;
        }

        // setup the inheritance chain
        App_Common_Models_Tools_Timer.prototype.constructor = App_Common_Models_Tools_Timer;

        return App_Common_Models_Tools_Timer;
    }

    //App_Common_Models_Tools_TimerFactory.$inject = [];

    angular.module('App_Common').factory('App_Common_Models_Tools_Timer',App_Common_Models_Tools_TimerFactory);
})();

