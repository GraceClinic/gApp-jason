(function () {

    /**
     *
     * @param App_Common_Abstracts_Model
     * @returns {WordShuffle_Models_Game_Round}
     */
    function WordShuffle_Models_Game_RoundFactory(App_Common_Abstracts_Model) {
        /**
         * One round within a Word Shuffle game
         *
         * @class       WordShuffle_Models_Game_Round
         * @extends     App_Common_Abstracts_Model
         * @param       {array}     [data]            - data array for setting properties during instantiation
         * @this        WordShuffle_Models_Game_Round
         * @returns     {WordShuffle_Models_Game_Round}
         */
        function WordShuffle_Models_Game_Round(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            // todo: set the URL address serving as backend api data source
            self._rootURL = '';

            /********************************
             * MODEL PROPERTIES declarations
             ********************************/
            /**
             * @property    WordShuffle_Models_Game_Round#idGame      - id of the associated Game object
             * @type        {int}
             * @public
             **/
            Object.defineProperty(self,'idGame',{get: getIdGame,set: setIdGame});
            /**
             * @property    WordShuffle_Models_Game_Round#Time      - seconds to complete the round
             * @type        {int}
             * @public
             **/
            Object.defineProperty(self,'Time',{get: getTime,set: setTime});
            /**
             * @property    WordShuffle_Models_Game_Round#wordCount      - number of words created during round
             * @type        {int}
             * @public
             **/
            Object.defineProperty(self,'wordCount',{get: getWordCount,set: setWordCount});
            /**
             * @property    WordShuffle_Models_Game_Round#points      - number of points scored during the round
             * @type        {int}
             * @public
             **/
            Object.defineProperty(self,'points',{get: getPoints,set: setPoints});
            /**
             * @property    WordShuffle_Models_Game_Round#start      - date / time started
             * @type        {date}
             * @public
             **/
            Object.defineProperty(self,'start',{get: getStart,set: setStart});
            /**
             * @property    WordShuffle_Models_Game_Round#end      - date / time ended
             * @type        {date}
             * @public
             **/
            Object.defineProperty(self,'end',{get: getEnd,set: setEnd});
            /**
             * @property    WordShuffle_Models_Game_Round#index      - index position of round within game
             * @type        {int}
             * @public
             **/
            Object.defineProperty(self,'index',{get: getIndex,set: setIndex,enumerable:true});



            /*****************************************
             * MODEL METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods 

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _idGame;
            function getIdGame(){
                return _idGame;
            }
            function setIdGame(value){
                _idGame = value;
            }
            var _Time;
            function getTime(){
                return _Time;
            }
            function setTime(value){
                _Time = value;
            }
            var _wordCount;
            function getWordCount(){
                return _wordCount;
            }
            function setWordCount(value){
                _wordCount = value;
            }
            var _points;
            function getPoints(){
                return _points;
            }
            function setPoints(value){
                _points = value;
            }
            var _start;
            function getStart(){
                return _start;
            }
            function setStart(value){
                _start = value;
            }
            var _end;
            function getEnd(){
                return _end;
            }
            function setEnd(value){
                _end = value;
            }
            var _index;
            function getIndex(){
                return _index;
            }
            function setIndex(value){
                _index = value;
            }

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor 

            App_Common_Abstracts_Model.call(self, data);

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            // todo:  determine if model properties found on the frontend should be excluded from backend
            self.excludeFromPost([]);

            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Game_Round.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Game_Round.prototype.constructor = WordShuffle_Models_Game_Round;

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        // todo: use the "ng_const" live template to insert new constants on the prototype, use ALL_CAPS_WITH_UNDERSCORE for name

        /*****************************************
         * PROTOTYPE PUBLIC PROPERTIES DECLARATION
         *****************************************/
        // todo: use the "ng_pprop" live template to insert prototype properties

        /*************************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION/DEFINITION
         *************************************************/
        // todo: use the "ng_pmethod" live template to insert prototype methods
        // todo:  use "ng_relay" to insert methods you wish to relay to the backend and service thereafter
         /* todo: Largely the basic save(), find(), delete(), and relay() methods do not change.  When they do and you only wish
          * to extend the logic, use "App_Common_Abstracts_Model.prototype.<<methodName>>.call(this)" to execute parent method.*/

        /**
         * Logic executed after find event returns
         *
         * @method   _postFind
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Round.prototype._postFind = function( ){
            // todo: determine if running logic after execution of the find() method
            return true;
        };

        /**
         * Processing executed after results return from a save operation.
         *
         * @method   _postSave
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Round.prototype._postSave = function() {
            // todo: determine if _postSave() logic required, otherwise delete
            return true;
        };


        /**
         * Model logic preceding any request to the backend: find(), save(), delete(), and relay()
         *
         * @method   _preDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Round.prototype._preDispatch = function () {
            // todo: determine if pre-dispatch logic required, otherwise delete
            return true;
        };

        /**
         * Model logic following return of any request from the backend: find(), save(), delete(), and relay()
         *
         * @method   _postDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Round.prototype._postDispatch = function () {
            return true;
        };

        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Game_Round;
    }

    WordShuffle_Models_Game_RoundFactory.$inject = ['App_Common_Abstracts_Model'];

    angular.module('App_WordShuffle').factory('WordShuffle_Models_Game_Round', WordShuffle_Models_Game_RoundFactory);
})();
