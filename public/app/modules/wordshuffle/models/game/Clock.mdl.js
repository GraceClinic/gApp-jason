(function () {

    /**
     * Model factory returning the constructor of the Model Clock
     *
     * @param {App_Common_Abstracts_Model}   App_Common_Abstracts_Model
     * @param   {function}                    $interval   - angularjs interval object
     * @returns {function(new:WordShuffle_Models_Game_Clock)}   - todo: correct this if it returns a singleton instance as opposed to the constructor
     * @constructor
     */
    function WordShuffle_Models_Game_ClockFactory(App_Common_Abstracts_Model, $interval) {
        /**
         * todo: provide short description of model
         *
         * @constructor
         * @extends     App_Common_Abstracts_Model
         * @param       {Object}     [data]            - data array for setting properties during instantiation
         * @this        WordShuffle_Models_Game_Clock
         * @returns     {WordShuffle_Models_Game_Clock}
         */
        function WordShuffle_Models_Game_Clock(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            var _start = null;
            
            /**
             * @var  {promise} _intervalId                   - $interval promise handle
             * @private
             */
            var _intervalId = null;

            /********************************
             * MODEL PROPERTIES declarations
             ********************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    WordShuffle_Models_Game_Clock#minutes      - minutes remaining
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'minutes',{get: getMinutes,set: setMinutes});
            /**
             * @property    WordShuffle_Models_Game_Clock#seconds      - seconds remaining
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'seconds',{get: getSeconds,set: setSeconds});
            /**
             * @property    WordShuffle_Models_Game_Clock#now      - number of seconds remaining on the clock
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'now',{get: getNow,set: setNow});
            /**
             * @property    WordShuffle_Models_Game_Clock#duration      - number of seconds to start on clock
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'duration',{get: getDuration,set: setDuration});

            /**
             * @property    WordShuffle_Models_Game_Clock#callOnExpire      - callback function to launch when clock expires
             * @type        function
             * @public
             **/
            Object.defineProperty(self,'callOnExpire',{get: getCallOnExpire,set: setCallOnExpire});

            /*****************************************
             * MODEL METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods
            /**
             * Start the countdown
             *
             * @method   start
             * @param   {int}     atTime  - start time to anchor, if null then it uses now
             * @public
             */
            self.start = function(atTime){
                _start = typeof atTime !== 'undefined' ? atTime : Date.now();
                if(_intervalId != null){
                    //if(!_intervalId.cancelled){
                    //if(!_intervalId.cancelled){
                        $interval.cancel(_intervalId);
                    //}
                }
                _intervalId = $interval(_updateClock, 200);
            };

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _minutes = '00';
            function getMinutes(){
                return _minutes;
            }
            function setMinutes(value){
                value = Math.floor(value);
                if(value > 9){
                    _minutes = value.toString();
                }else{
                    _minutes = '0';
                    _minutes = _minutes.concat(value.toString());
                }
            }
            var _seconds = '00';
            function getSeconds(){
                return _seconds;
            }
            function setSeconds(value){
                value = Math.floor(value);
                if(value > 9){
                    _seconds = value.toString();
                }else{
                    _seconds = '0';
                    _seconds = _seconds.concat(value.toString());
                }
            }
            var _now = 0;
            function getNow(){
                return _now;
            }
            function setNow(value){
                _now = Math.floor(value);

                if(_now <= 0){
                    _now = 0;
                    self.seconds = 0;
                    self.minutes = 0;
                    $interval.cancel(_intervalId);
                    self.callOnExpire();
                }else{
                    self.seconds = _now % 60;
                    self.minutes = _now / 60;
                }
            }
            var _callOnExpire;
            function getCallOnExpire(){
                return _callOnExpire;
            }
            function setCallOnExpire(value){
                _callOnExpire = value;
            }
            var _duration = 120;
            function getDuration(){
                return _duration;
            }
            function setDuration(value){
                if(value > 0){
                    _duration = value;
                    self.now = _duration;
                }
            }

            /**
             * stop the clock
             *
             * @method   stop
             * @public               - todo: scope as public or protected, prefix name with "_" for protected
             */
            self.stop = function(){
                $interval.cancel(_intervalId);
            };

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor
            function _updateClock(){
                self.now = (self.duration*1000 - (Date.now() - _start)) / 1000;
            }

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', self.constructor.name);
            // extend from the super class
            App_Common_Abstracts_Model.call(self, data);

            self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Game_Clock.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Game_Clock.prototype.constructor = WordShuffle_Models_Game_Clock;

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        // todo: use the "ng_const" live template to insert new constants on the prototype, use ALL_CAPS_WITH_UNDERSCORE for name

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Game_Clock;
    }

    WordShuffle_Models_Game_ClockFactory.$inject = ['App_Common_Abstracts_Model','$interval'];

    angular.module('App_WordShuffle').factory('WordShuffle_Models_Game_Clock', WordShuffle_Models_Game_ClockFactory);
})();
