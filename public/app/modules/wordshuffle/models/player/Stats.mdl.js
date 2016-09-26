(function () {

    // todo: Add other dependencies passed as parameters to the Factory
    // If the parameters passed are constructors document as {function(new:<Model_Name>)}.
    // If the parameters passes are singletons document as {<Model_Name>}
    /**
     * Model factory returning the <singleton or constructor> for the Model Stats
     *
     * @param {App_Common_Abstracts_Model}   App_Common_Abstracts_Model
     * @returns {WordShuffle_Models_Player_Stats}
     */
    function WordShuffle_Models_Player_StatsFactory(App_Common_Abstracts_Model, $http) {
        /**
         * @class       WordShuffle_Models_Player_Stats
         * todo: provide short description of model
         *
         * @extends     App_Common_Abstracts_Model
         * @param       {Object}     [data]            - optional data object for setting properties during instantiation
         * @this        WordShuffle_Models_Player_Stats
         * @returns     {WordShuffle_Models_Player_Stats}
         */
        function WordShuffle_Models_Player_Stats(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /****************************************
             * MODEL PROPERTIES / GETTERS and SETTERS
             ****************************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    idPlayer
             * this is the playerId whose stats it belongs
             *
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'idPlayer',{get: getIdPlayer, set: setIdPlayer, enumerable:true});
            var _idPlayer;
            function getIdPlayer(){
                return _idPlayer;
            }
            function setIdPlayer(value){
                _idPlayer = value;
            }

            /**
             * @property    roundDuration
             * seconds per round
             *
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'roundDuration',{get: getRoundDuration, set: setRoundDuration, enumerable:true});
            var _roundDuration = 60;
            function getRoundDuration(){
                return _roundDuration;
            }
            function setRoundDuration(value){
                _roundDuration = value;
            }

            /**
             * @property    roundHigh
             * highest points achieved for all rounds played with indicated duration
             *
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'roundHigh',{get: getRoundHigh, set: setRoundHigh, enumerable:true});
            var _roundHigh;
            function getRoundHigh(){
                return _roundHigh;
            }
            function setRoundHigh(value){
                _roundHigh = value;
            }

            /**
             * @property    roundAvg
             * average points achieved amongst all rounds played with indicated duration
             *
             * @type    {float}
             * @public
             **/
            Object.defineProperty(self,'roundAvg',{get: getRoundAvg, set: setRoundAvg, enumerable:true});
            var _roundAvg;
            function getRoundAvg(){
                return _roundAvg;
            }
            function setRoundAvg(value){
                _roundAvg = value;
            }
            

            /**
             * @property    avgPtsPerWord
             * average amount of points made per words played in all rounds with indicated duration
             *
             * @type    {float}
             * @public
             **/
            Object.defineProperty(self,'avgPtsPerWord',{get: getAvgPtsPerWord, set: setAvgPtsPerWord, enumerable:true});
            var _avgPtsPerWord;
            function getAvgPtsPerWord(){
                return _avgPtsPerWord;
            }
            function setAvgPtsPerWord(value){
                _avgPtsPerWord = value;
            }

            /**
             * @property    avgWordCount
             * average number of words played in all rounds with indicated duration
             *
             * @type    {float}
             * @public
             **/
            Object.defineProperty(self,'avgWordCount',{get: getAvgWordCount, set: setAvgWordCount, enumerable:true});
            var _avgWordCount;
            function getAvgWordCount(){
                return _avgWordCount;
            }
            function setAvgWordCount(value){
                _avgWordCount = value;
            }

            /**
             * @property    longestWord
             * the longest word played within all rounds with indicated duration
             *
             * @type    {string}
             * @public
             **/
            Object.defineProperty(self,'longestWord',{get: getLongestWord, set: setLongestWord, enumerable:true});
            var _longestWord;
            function getLongestWord(){
                return _longestWord;
            }
            function setLongestWord(value){
                _longestWord = value;
            }

            /**
             * @property    totalRounds
             * the total number of rounds played with indicated duration
             *
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'totalRounds',{get: getTotalRounds, set: setTotalRounds, enumerable:true});
            var _totalRounds;
            function getTotalRounds(){
                return _totalRounds;
            }
            function setTotalRounds(value){
                _totalRounds = value;
            }

            /**
             * @property    roundDurationsAvailable
             * array containing the available minutes which can be played in a round, this is not working with ng-options, so commented
             *
             * @type    {array}
             * @public
             **/
            // Object.defineProperty(self,'roundDurationsAvailable',{get: getRoundDurationsAvailable, set: setRoundDurationsAvailable, enumerable:true});
            // //var _roundDurationsAvailable = [];
            // function getRoundDurationsAvailable(){
            //     var _durationsArray = [];
            //     for (var i = 1; i <= 3; i ++) {
            //         var _temp = {};
            //         _temp.val = i;
            //         _temp.msg = i + " minutes(s) ";
            //         _durationsArray.push(_temp);
            //     }
            //     return _durationsArray;
            // }
            // function setRoundDurationsAvailable(value){
            //     self.SysMan.Logger.entry("Not allowed to set number of rounds, this config not available source(", self.className + ")");
            // }



            /**
             * @property    selectedDuration
             * fetch the stats for this duration
             *
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'selectedDuration',{get: getSelectedDuration, set: setSelectedDuration, enumerable:true});
            var _selectedDuration = 60;
            function getSelectedDuration(){
                //console.log("value returned", _selectedDuration);
                return _selectedDuration;
            }
            function setSelectedDuration(value){
                console.log("value selected", value);
                _selectedDuration = value;
            }
            


            /*****************************************
             * MODEL METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods

            /**
             * @method   find
             * override the abstract's find
             *
             * @public                      - todo: scope as public or protected, prefix name with "_" for protected
             * @param    {}                 - todo: document each parameter
             * @return   {$promise}
             */
            self.find = function () {
                var self = this;
                var _url = self._rootURL;
                var _promise = null;

                self.SysMan.Logger.entry('START '+self.constructor.name+'.find()','App_Common_Abstracts_Model');

                if(self.selectedDuration >= -1){
                    _url = _url + '?roundDuration=' + self.selectedDuration;
                }

                self.status = self.PRE_DISPATCH;
                
                if(self._preDispatch()){
                    _promise = $http({url:_url,method: "GET"})
                        .then(
                            function(response) {
                                self.status = self.POST_DISPATCH;
                                self.SysMan.Logger.entry('START ' + self.constructor.name + '.find() response process','App_Common_Abstracts_Model');
                                if('model' in response.data){
                                    self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                                    self.setFromArray(response.data.model);
                                    console.log("response obtained", response.data.model);
                                    self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                                }
                                self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                                self._postDispatch();
                                self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                                self.SysMan.Logger.entry('START ' + self.constructor.name + '._postFind()','App_Common_Abstracts_Model');
                                self._postFind();
                                self.SysMan.Logger.entry('END ' + self.constructor.name + '._postFind()','App_Common_Abstracts_Model');
                                self.status = self.READY;
                                self.SysMan.Logger.entry('END ' + self.constructor.name + '.find() response process','App_Common_Abstracts_Model');

                                // return the response to support daisy chaining usage as required
                                return response;
                            },
                            function() {
                                self.status = self.POST_DISPATCH;
                                // error processed by App Interceptor
                                return $http.reject
                            }
                        );
                }else{
                    self.status = self.READY;
                }

                self.SysMan.Logger.entry('END '+self.constructor.name+'.find()','App_Common_Abstracts_Model');

                return _promise;
            };




            /**
             * @method   fetchStats
             * returns the stats of the current Player for the selected duration
             *
             * @public                      - todo: scope as public or protected, prefix name with "_" for protected
             * @param    {}                 - todo: document each parameter
             * @return   {object}
             */
            self.fetchStats = function(){
                self.find();
            };


            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor 

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()');
            // extend from the super class, execute constructor and copy all properties therein to this class
            App_Common_Abstracts_Model.call(self, data);

            // todo: set the URL address serving as backend api data source
            self._rootURL = '/WordShuffle/Player_Stats';

            // todo:  determine if model properties defined on the frontend should be excluded from backend
            self.excludeFromPost([]);

            self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()');

            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Player_Stats.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Player_Stats.prototype.constructor = WordShuffle_Models_Player_Stats;

        /*********************
         * PROTOTYPE CONSTANTS
         *********************/
        // todo: use the "ng_const" live template to insert new constants on the prototype, use ALL_CAPS_WITH_UNDERSCORE for name

        /***************************************************
         * PROTOTYPE PUBLIC PROPERTIES / SETTERS and GETTERS
         ***************************************************/
        // todo: use the "ng_pprop" live template to insert prototype properties

        /*************************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION/DEFINITION
         *************************************************/
        // todo: use the "ng_pmethod" live template to insert prototype methods
        // todo:  use "ng_relay" to insert methods you wish to relay to the backend and service thereafter
         /* todo: Largely the basic save(), find(), delete(), and relay() methods do not change.  When they do and you only wish
          * to extend the logic, use "App_Common_Abstracts_Model.prototype.<<methodName>>.call(this)" to execute parent method.*/

        /**
         * @method   _postFind
         * Logic executed after find event returns
         *
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Player_Stats.prototype._postFind = function( ){
            // todo: determine if running logic after execution of the find() method
            return true;
        };

        /**
         * @method   _postSave
         * Processing executed after results return from a save operation.
         *
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Player_Stats.prototype._postSave = function() {
            // todo: determine if _postSave() logic required, otherwise delete
            return true;
        };


        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new WordShuffle_Models_Player_Stats;
    }

    // todo: inject dependencies
    WordShuffle_Models_Player_StatsFactory.$inject = [
        'App_Common_Abstracts_Model',
        '$http'
    ];

    // register model with Angularjs application
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Player_Stats', WordShuffle_Models_Player_StatsFactory);
})();
