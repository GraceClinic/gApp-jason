(function () {

    /**
     * Model factory returning a <singleton or constructor> of the Model ${Name}
     *
     * @param {App_Common_Abstracts_Model}      Model      - superclass
     * @param {App_Common_Models_Tools_Timer}   Timer       - Timer object for tracking game
     * @param {function(WordShuffle_Models_Round)}        Round       - Round object that create the game
     * @returns {WordShuffle_Models_Game}
     * @constructor
     */
    function Game_Factory(Model,Timer,Round) {
        /**
         * << Short description for model >>
         *
         * @class       WordShuffle_Models_Game
         * @extends     {App_Common_Abstracts_Model}
         * @param       {array}     [data]        - associative array of model properties
         * @this        WordShuffle_Models_Game
         * @returns     {WordShuffle_Models_Game}
         */
        function WordShuffle_Models_Game(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            self._rootURL = '/WordShuffle/Game/';

            /************************
             * Public Properties declarations
             ************************/
            /**
             * @property    {int}       idPlayer
             */
            Object.defineProperty(self,"idPlayer",{get: getIdPlayer,set: setIdPlayer});
            /**
             * @property    {Timer}     Timer
             */
            Object.defineProperty(self,"Timer",{get: getTimer,set: setTimer});
            /**
             * @property    {int}       round
             */
            Object.defineProperty(self,"round",{get: getRound,set: setRound});
            /**
             * @property    {Board}     Board
             */
            Object.defineProperty(self,"Board",{get: getBoard,set: setBoard});
            /**
             * @property    {int}       roundsPerGame
             */
            Object.defineProperty(self,"roundsPerGame",{get: getRoundsPerGame,set: setRoundsPerGame});
            /**
             * @property    {int}       secondsPerRound
             */
            Object.defineProperty(self,"secondsPerRound",{get: getSecondsPerRound,set: setSecondsPerRound});
            /**
             * @property    {int}       points
             */
            Object.defineProperty(self,"points",{get: getPoints,set: setPoints});
            /**
             * @property    {date}      start
             */
            Object.defineProperty(self,"start",{get: getStart,set: setStart});
            /**
             * @property    {date}      end
             */
            Object.defineProperty(self,"end",{get: getEnd,set: setEnd});
            /**
             * @property    {WordShuffle_Models_Round[]}    Rounds
             */
            Object.defineProperty(self,"Rounds",{get: getRounds,set: setRounds});
            /**
             * @property    WordShuffle_Models_Game#roundAvg      - average points per round
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'roundAvg',{get: getRoundAvg,set: setRoundAvg});


            /*****************************************
             * Public Methods declaration / definition
             *****************************************/
            // todo:  use "method#" live template to insert individual model methods

            // The above maintains a clean class definition, promoting readability and maintainability.  Follow
            // with the any constructor logic.  This is what should be done during instantiation of the controller.

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _idPlayer = 0;
            function getIdPlayer(){
                return _idPlayer;
            }
            function setIdPlayer(value){
                _idPlayer = value;
            }
            var _Timer = null;
            function getTimer(){
                return _Timer;
            }
            function setTimer(value){
                _Timer = value;
            }
            var _round = 1;
            function getRound(){
                return _round;
            }
            function setRound(value){
                _round = value;
            }
            var _Board = null;
            function getBoard(){
                return _Board;
            }
            function setBoard(value){
                _Board = value;
            }
            var _secondsPerRound = 0;   // default set from backend
            function getSecondsPerRound(){
                return _secondsPerRound;
            }
            function setSecondsPerRound(value){
                _secondsPerRound = value;
            }
            var _roundsPerGame = 0;     // default set from backend
            function getRoundsPerGame(){
                return _roundsPerGame;
            }
            function setRoundsPerGame(value){
                _roundsPerGame = value;
            }
            var _points = 0;
            function getPoints(){
                return _points;
            }
            function setPoints(value){
                _points = value;
            }
            var _start = null;
            function getStart(){
                return _start;
            }
            function setStart(value){
                _start = value;
            }
            var _end = null;
            function getEnd(){
                return _end;
            }
            function setEnd(value){
                _end = value;
            }
            var _Rounds = [];
            function getRounds(){
                return _Rounds;
            }
            function setRounds(rounds){
                if(Object.prototype.toString.call(rounds) === '[object Array]'){
                    // reset current values
                    var roundsAreDefined = _Rounds.length == rounds.length;
                    if(!roundsAreDefined) {
                        _Rounds = [];
                    }
                    for(var i=0;i<rounds.length;i++){
                        if(roundsAreDefined){
                            _Rounds[i].setFromArray(rounds[i]);
                        }else{
                            _Rounds[i] = new Round(rounds[i]);
                        }
                    }
                }else if(rounds == null || rounds == ''){
                    _Rounds = [];
                }else{
                    self.SysMan.Logger.entry('setRounds() invoked with argument that was not an array.',self.constructor.name,self.SysMan.Logger.TYPE.ERROR);
                }
            }
            var _roundAvg = 0;
            function getRoundAvg(){
                return _roundAvg;
            }
            function setRoundAvg(value){
                _roundAvg = value;
            }

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            Model.call(self,data);

            self.excludeFromPost(['idPlayer','Timer','Board','points','start','end','roundAvg']);

            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Game.prototype = Object.create(Model.prototype);
        WordShuffle_Models_Game.prototype.constructor = WordShuffle_Models_Game;

        /*****************************************
         * PROTOTYPE PUBLIC PROPERTIES DECLARATION
         *****************************************/

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION
         *****************************************/
        /**
         * Process Game state after return of safe operation
         *
         * @method   _postSave
         * @public
         */
        WordShuffle_Models_Game.prototype._postSave = function(){

        };


        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/
        // move getter and setter definitions here resulting from execution of the "mpp" live template

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DEFINITION
         *****************************************/
        // move the method definition here resulting from execution of the "mpm" live template

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new WordShuffle_Models_Game;
    }

    // inject dependenciesObject
    Game_Factory.$inject = ['App_Common_Abstracts_Model','App_Common_Models_Tools_Timer', 'WordShuffle_Models_Round'];

    // register model with Angularjs application for dependency injection as required
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Game', Game_Factory);
})();
