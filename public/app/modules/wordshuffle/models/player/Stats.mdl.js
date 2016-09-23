(function () {

    // todo: Add other dependencies passed as parameters to the Factory
    // If the parameters passed are constructors document as {function(new:<Model_Name>)}.
    // If the parameters passes are singletons document as {<Model_Name>}
    /**
     * Model factory returning the <singleton or constructor> for the Model Stats
     *
     * @param {App_Common_Abstracts_Model}   App_Common_Abstracts_Model
     * @param  {function}   $http      -- http object
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

            /********************************
             * MODEL PROPERTIES declarations
             ********************************/
            /**
             * @property    idPlayer        -- id of the registered player
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'idPlayer',{get: getIdPlayer, set: setIdPlayer});

            /**
             * @property    roundDuration           -- Number of seconds in a round
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'roundDuration',{get: getRoundDuration, set: setRoundDuration});

            /**
             * @property    roundHigh              -- Highest points scored in a particular round duration by a specific Player
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'roundHigh',{get: getRoundHigh, set: setRoundHigh});

            /**
             * @property    roundAvg            -- Average points scored in a particular round duration by a specific player
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'roundAvg',{get: getRoundAvg, set: setRoundAvg});

            /**
             * @property    avgPtsPerWord               -- Average points scored per word for a particular round duration
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'avgPtsPerWord',{get: getAvgPtsPerWord, set: setAvgPtsPerWord});

            /**
             * @property    avgWordCount                -- Average number of words made against a particular round duration
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'avgWordCount',{get: getAvgWordCount, set: setAvgWordCount});

            /**
             * @property    longestWord                 -- longest word found within a particular round duration by a specific Player
             * @type    {string}
             * @public
             **/
            Object.defineProperty(self,'longestWord',{get: getLongestWord, set: setLongestWord});

            /**
             * @property    totalRounds                 -- total number of rounds played for a particular round duration by a Player
             * @type    {int}
             * @public
             **/
            Object.defineProperty(self,'totalRounds',{get: getTotalRounds, set: setTotalRounds});

            /****************************************
             * MODEL PROPERTIES / GETTERS and SETTERS
             ****************************************/

            var _idPlayer;
            function getIdPlayer(){
                return _idPlayer;
            }

            function setIdPlayer(value){
                _idPlayer = value;
            }

            var _roundDuration = 60;
            function getRoundDuration(){
                return _roundDuration;
            }

            function setRoundDuration(value){
                _roundDuration = value;
            }

            var _roundHigh;
            function getRoundHigh(){
                return _roundHigh;
            }

            function setRoundHigh(value){
                _roundHigh = value;
            }

            var _roundAvg;
            function getRoundAvg(){
                if(_roundAvg != 0)
                _roundAvg = Math.round( _roundAvg * 10 ) / 10;
                return _roundAvg;
            }

            function setRoundAvg(value){
                _roundAvg = value;
            }

            var _avgPtsPerWord;
            function getAvgPtsPerWord(){
                if(_avgPtsPerWord !=0 )
                _avgPtsPerWord = Math.round( _avgPtsPerWord * 10 ) / 10;
                return _avgPtsPerWord;
            }

            function setAvgPtsPerWord(value){
                _avgPtsPerWord = value;
            }

            var _avgWordCount;
            function getAvgWordCount(){
                if(_avgWordCount !=0 )
                _avgWordCount = Math.round( _avgWordCount * 10 ) / 10;
                return _avgWordCount;
            }

            function setAvgWordCount(value){
                _avgWordCount = value;
            }

            var _longestWord;
            function getLongestWord(){
                return _longestWord;
            }

            function setLongestWord(value){
                _longestWord = value;
            }

            var _totalRounds;
            function getTotalRounds(){
                return _totalRounds;
            }

            function setTotalRounds(value){
                _totalRounds = value;
            }

            /*****************************************
             * MODEL METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods 

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor 

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()',self.constructor.name);
            // extend from the super class, execute constructor and copy all properties therein to this class
            App_Common_Abstracts_Model.call(self, data);

            // todo: set the URL address serving as backend api data source
            self._rootURL =  '/WordShuffle/Player_Stats/';

            // todo:  determine if model properties defined on the frontend should be excluded from backend
            self.excludeFromPost([]);

            self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()',self.constructor.name);

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

        WordShuffle_Models_Player_Stats.prototype.find = function(){
            var self = this;
            self.SysMan.Logger.entry('START '+self.constructor.name+'.find()',self.constructor.name);
            var _promise = null;
            var _url = self._rootURL + '?roundDuration=' + self.roundDuration;
            self.status = self.PRE_DISPATCH;

            if(self._preDispatch()){
                _promise = $http({url:_url,method: "GET"})
                    .then(
                        function(response) {
                            self.status = self.POST_DISPATCH;
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '.find() response process',self.constructor.name);
                            if('model' in response.data){
                                self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data',self.constructor.name);
                                self.setFromArray(response.data.model);
                                self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data',self.constructor.name);
                            }
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()',self.constructor.name);
                            self._postDispatch();
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()',self.constructor.name);
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '._postFind()',self.constructor.name);
                            self._postFind();
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '._postFind()',self.constructor.name);
                            self.status = self.READY;
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '.find() response process',self.constructor.name);

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

            self.SysMan.Logger.entry('END '+self.constructor.name+'.find()',self.constructor.name);

            return _promise;
        };

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

        /**
         * Logic to apply before any dispatch to the backend
         *
         * @method   _preDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Player_Stats.prototype._preDispatch = function(){
            // clear stat messages before sending request
            this.msg = [];
            return true;
        };

        /**
         * Logic to apply after any dispatch to the backend
         *
         * @method   _postDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Player_Stats.prototype._postDispatch = function(){
            return true;
        };

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

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
