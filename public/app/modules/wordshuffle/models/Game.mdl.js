(function () {

    /**
     * Model factory returning a single instance of WordShuffle_Models_Game
     *
     * @param {App_Common_Abstracts_Model}      Model      - superclass
     * @param {App_Common_Models_Tools_Timer}   Timer       - Timer object for tracking game
     * @param          Round       - Round object that create the game
     * @param         Square      - game square object constructor
     * @param         Clock      - game clock constructor
     * @returns {WordShuffle_Models_Game}
     * @constructor
     */
    function Game_Factory(Model,Timer,Round,Square,Clock) {

        /**
         * WordShuffle game
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
             * @property    {WordShuffle_Models_Game_Round[]}    Rounds
             */
            Object.defineProperty(self,"Rounds",{get: getRounds,set: setRounds});
            /**
             * @property    WordShuffle_Models_Game#roundAvg      - average points per round
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'roundAvg',{get: getRoundAvg,set: setRoundAvg});
            /**
             * @property    WordShuffle_Models_Game#Squares      - array of game squares
             * @type        WordShuffle_Models_Game_Square[]
             * @public
             **/
            Object.defineProperty(self,'Squares',{get: getSquares,set: setSquares});
            /**
             * @property    WordShuffle_Models_Game#state      - tracks game state as COMPLETED, IN_PROGRESS, or ABANDONED
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'state',{get: getState,set: setState});
            /**
             * @property    WordShuffle_Models_Game#Clock      - game clock
             * @type        WordShuffle_Models_Game_Clock
             * @public
             **/
            Object.defineProperty(self,'Clock',{get: getClock,set: setClock});
            /**
             * @property    WordShuffle_Models_Game#word      - current word being built by user
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'word',{get: getWord,set: setWord, enumerable:true});
            /**
             * @property    WordShuffle_Models_Game#wordSquares      - squares that created the current word
             * @type        WordShuffle_Models_Game_Square[]
             * @public
             **/
            Object.defineProperty(self,'wordSquares',{get: getWordSquares,set: setWordSquares});


            /*****************************************
             * Public Methods declaration / definition
             *****************************************/
            // todo:  use "method#" live template to insert individual model methods

            // The above maintains a clean class definition, promoting readability and maintainability.  Follow
            // with the any constructor logic.  This is what should be done during instantiation of the controller.

            Object.defineProperty(WordShuffle_Models_Game.prototype,"ROWS",{value: 5, writable: false});
            Object.defineProperty(WordShuffle_Models_Game.prototype,"COLS",{value: 5, writable: false});
            
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
                self.Clock.duration = _secondsPerRound;
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
            var _Squares = [];
            function getSquares(){
                // TODO: default configuration should establish at construct if Game object does not contain actual Square values
                var row = [];
                if(_Squares.length == 0){
                    for(var i=1;i<=self.ROWS;i++){
                        row = [];
                        for(var j=1;j<=self.COLS;j++){
                            row.push(
                                new Square({
                                        letter:         'X',
                                        row:            i,
                                        col:            j,
                                        isSelected:     false,
                                        callOnClick:    self.buildWord
                                    }
                                )
                            );
                        }
                        _Squares.push(row);
                    }
                }
                return _Squares;
            }
            function setSquares(value){
                var squaresNotDefined = _Squares.length == 0;

                var row = [];
                var _square = null;
                if(value.length == self.ROWS){
                    if(value[0].length == self.COLS){
                        for(var i=1;i<=self.ROWS;i++){
                            row = [];
                            for(var j=1;j<=self.COLS;j++){
                                var _sqData = value[i-1][j-1];
                                if(squaresNotDefined){
                                    _square = new Square(_sqData);
                                    row.push(_square);
                                }else{
                                    _square = _Squares[_sqData['Row']-1][_sqData['Col']-1];
                                    _square.setFromArray(_sqData);
                                }
                                // set the click action
                                _square.callOnClick = self.buildWord;
                            }
                            if(squaresNotDefined){
                                _Squares.push(row);
                            }
                        }
                    }
                }
            }
            var _state;
            function getState(){
                return _state;
            }
            function setState(value){
                if(value!==null){
                    var _validValues = [self.NEW_GAME,self.IN_PROGRESS, self.COMPLETED, self.ABANDONED];
                    if(_validValues.indexOf(value)>=0){
                        _state = value;
                    }else{
                        self.SysMan.Logger.entry(
                            'Game.setState called with improper argument = '+value,
                            self.constructor.name,
                            self.SysMan.Logger.TYPE.ERROR
                        );
                    }
                }
            }
            var _Clock = new Clock();
            function getClock(){
                return _Clock;
            }
            function setClock(value){
                _Clock = value;
            }
            var _word = '???';
            function getWord(){
                return _word;
            }
            function setWord(value){
                _word = value;
                if(_word == '' || _word == '???'){
                    // reset the array storing squares that created the word
                    _wordSquares = [];
                }
            }
            var _wordSquares = [];
            function getWordSquares(){
                return _wordSquares;
            }
            function setWordSquares(value){
                _wordSquares = value;
            }
            /**
             * Notification from square regarding user selection.
             *
             * @method   buildWord
             * @public
             * @param    {WordShuffle_Models_Game_Square}   Square  - game square object initiating call
             */
            self.buildWord = function(Square){
                if(Square.isSelected){
                    // check for valid square, it must be adjacent to last selected square
                    if(_wordSquares.length > 0){
                        var _last = _wordSquares[_wordSquares.length-1];
                        if(Math.abs(_last.row - Square.row)<=1 && Math.abs(_last.col - Square.col)<=1){
                            _wordSquares.push(Square);
                            self.word = self.word.concat(Square.letter);
                        }else{
                            Square.isSelected = false;
                            // todo: play audio sound
                        }
                    }else{
                        _wordSquares.push(Square);
                        self.word = Square.letter;
                    }

                }else{
                    var _popSquare = _wordSquares.pop();
                    while(_popSquare.uid != Square.uid && _wordSquares.length > 0){
                        // remove all letters that preceded the de-selected letter
                        self.word = self.word.substring(0,self.word.length-1);
                        _popSquare.isSelected = false;
                        _popSquare = _wordSquares.pop();
                    }
                    // remove the de-selected letter from the current word
                    self.word = self.word.substring(0,self.word.length-1);
                    if(_wordSquares.length == 0){
                        self.word = '???';
                    }
                }

            };

            // watch for key presses
            jQuery(document).on('keypress',function(e){
                // if ENTER key, submit word
                if(e.which == 13){
                    self.submitWord();
                }
            });

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            self.SysMan.Logger.entry('START ' + self.constructor.name+'.construct()',self.constructor.name);
            Model.call(self,data);

            self.excludeFromPost([
                'idPlayer',
                'Timer',
                'Board',
                'points',
                'start',
                'end',
                'roundAvg',
                'Squares',
                'state',
                'Clock',
                'NEW_GAME',
                'IN_PROGRESS',
                'COMPLETED',
                'ABANDONED',
                'ROWS',
                'COLS'
            ]);

            self.SysMan.Logger.entry('END ' + self.constructor.name+'.construct()',self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Game.prototype = Object.create(Model.prototype);
        WordShuffle_Models_Game.prototype.constructor = WordShuffle_Models_Game;

        Object.defineProperty(WordShuffle_Models_Game.prototype,"NEW_GAME",{value: 'New', writable: false});
        Object.defineProperty(WordShuffle_Models_Game.prototype,"IN_PROGRESS",{value: 'InProgress', writable: false});
        Object.defineProperty(WordShuffle_Models_Game.prototype,"COMPLETED",{value: 'Completed', writable: false});
        Object.defineProperty(WordShuffle_Models_Game.prototype,"ABANDONED",{value: 'Abandoned', writable: false});
                        

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
            this.Clock.start();
        };

        /**
         * submit word to backend for processing
         *
         * @method   submitWord
         * @public
         */
        WordShuffle_Models_Game.prototype.submitWord = function(){
            if(this.word.length > 1){
                this.relay('submitWord',true);
            }
        };

        /**
         * Logic the follows return of the submitWord from the backend.  Since $http request are asynchronous, this method allows
         * proper reaction after backend returns data from the relayed submitWord method.
         *
         * @method   _postSubmitWord
         * @protected
         * @param    {object}   oResults   - the results returned from the backend after relay of the submitWord method
         */
        WordShuffle_Models_Game.prototype._postSubmitWord = function(oResults){
            this.word = oResults.msg;

            // clear the current selected squares
            for(var i=0;i<this.wordSquares.length;i++){
                this.wordSquares[i].isSelected = false;
            }

            // reset the array of squares that make the word
            this.wordSquares = [];
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
    Game_Factory.$inject = [
        'App_Common_Abstracts_Model',
        'App_Common_Models_Tools_Timer',
        'WordShuffle_Models_Game_Round',
        'WordShuffle_Models_Game_Square',
        'WordShuffle_Models_Game_Clock'
    ];

    // register model with Angularjs application for dependency injection as required
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Game', Game_Factory);
})();
