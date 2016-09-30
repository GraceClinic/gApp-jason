(function () {
    /**
     * Services actions during game play.
     *
     * @constructor
     * @extends         {App_Common_Abstracts_ActionController}
     * @param   {object}      $scope      - local angular scope for this controller
     * @param   {function}    $controller - angular controller service responsible for instantiating controllers
     * @param   {WordShuffle_Models_Game}   Game        - singleton Game object, only one game active per player
     * @param   {WordShuffle_Models_Player} Player      - singleton Player object, only one player across controllers
     * @param   {WordShuffle_Models_Player_Stats} Stats  - singleton Stats object, stats belongs to one single player
     * @this    WordShuffle_Controllers_Play
     */
    function WordShuffle_Controllers_Play($scope, $controller, Game, Player, Stats) {
        var self = this;

        var _blockFetch = false;    // flag to block additional request to the backend when changing states
        var _blockFetchModal = false; // flag to stop reloading index page when modal disappears

        /*************************************************
         * PROPERTY DECLARATIONS with GETTERS and SETTERS
         *************************************************/
        /**
         * @property    WordShuffle_Controllers_Play#Game      - active game object
         * @type        WordShuffle_Models_Game
         * @public
         **/
        Object.defineProperty(self,'Game',{get: getGame,set: setGame});
        function getGame(){
            return Game;
        }
        function setGame(){
            self.SysMan.Logger.entry('Game.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }
        /**
         * @property    WordShuffle_Controllers_Play#Player      - player object
         * @type        WordShuffle_Models_Player
         * @public
         **/
        Object.defineProperty(self,'Player',{get: getPlayer,set: setPlayer});
        function getPlayer(){
            return Player;
        }
        function setPlayer(){
            self.SysMan.Logger.entry('Player.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        /**
         * @property     WordShuffle_Controllers_Play#Stats                   - Stats object
         * @type        WordShuffle_Models_Player_Stats
         * @public
         **/
        Object.defineProperty(self,'Stats',{get: getStats, set: setStats});
        function getStats(){
            return Stats;
        }
        function setStats(){
            self.SysMan.Logger.entry('Stats.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        /**
         * @property    WordShuffle_Controllers_Play#roundDuration      - translate minutes to Stats->roundDuration
         * @type        int
         * @public
         **/
        Object.defineProperty(self,'roundDuration',{get: getRoundDuration,set: setRoundDuration});
        function getRoundDuration(){
            return self.Stats.roundDuration/60;
        }
        function setRoundDuration(value){
            self.Stats.roundDuration = value * 60;
            if(!_blockFetch) {
                self.findStatsForPlayer();
                _blockFetch = true;
            }
            else{
                _blockFetch = false;
            }
        }


        /**
         * @property    WordShuffle_Controllers_Play#minutesPerRound    - calculate minutes per round
         * @type    {int}
         * @public
         **/
        Object.defineProperty(self,'minutesPerRound',{get: getMinutesPerRound, set: setMinutesPerRound});
        function getMinutesPerRound(){
            return self.Player.secondsPerRound/60;
        }
        function setMinutesPerRound(value){
            self.Player.secondsPerRound = value*60;
        }

        /**
         * @property    toggleConfigModal
         * toggles as hide/show for the game detail configuration modal
         * @type    {boolean}
         * @public
         **/
        Object.defineProperty(self,'toggleConfigModal',{get: getToggleConfigModal, set: setToggleConfigModal});
        var _toggleConfigModal = true;
        function getToggleConfigModal(){
            return _toggleConfigModal;
        }
        function setToggleConfigModal(value){
            _toggleConfigModal = value;
        }

        /****************************
         * ACTION METHODS DEFINITION
         ****************************/
        /**
         * Logic following index action against the Play controller
         *
         * @method   indexAction
         * @public
         */
        self.indexAction = function(){
            // update the player and game information based on backend
            if(Game.state == Game.IN_PROGRESS){
                _blockFetchModal = false;
                self.goToState('wordshuffle','play','play');
            }
            else if(!_blockFetch){
                Player.find();
                var _promise = Game.find();

                if(_promise !== null){
                    _promise.then(function(){
                        if(typeof Game.state == 'undefined' || Game.state == Game.COMPLETED){
                            self.msg = 'You do not have an active game!  Click "Play" if you wish to use your current settings to start a new one.'
                        }
                    });
                }
                _blockFetchModal = true;
            }
            else{
                // reset flag for next action
                _blockFetch = false;
                _blockFetchModal = true;
            }
            self.findStatsForPlayer();
        };

        /**
         * Game in play
         *
         * @method   playAction
         * @public
         */
        self.playAction = function(){

            if(self.Game.newGame){
                self.Game.roundsPerGame = self.Player.roundsPerGame;
                self.Game.secondsPerRound = self.Player.secondsPerRound;
                self.Game.idPlayer = self.Player.id;
                self.Game.state = self.Game.IN_PROGRESS;
                self.Game.save();
                self.Game.newGame = false;
                _blockFetchModal = true;
            }
            else if(self.Game.state == null || self.Game.state == self.Game.ABANDONED || self.Game.state == self.Game.COMPLETED){
                self.goToState('wordshuffle','play','index');
            }
            else {
                if (!_blockFetchModal) {
                    var _promise = Game.find();
                    self.SysMan.msg = {
                        text: 'Please finish your active game!',
                        type: 'INFO'
                    };
                    if (_promise !== null) {
                        _promise.then(function () {
                            // update clock
                            var _atTime = new Date((Date.now() - (self.Game.secondsPerRound - self.Game.timeRemaining) * 1000));
                            self.Game.Clock.start(_atTime);
                            self.Game.Clock.now = self.Game.timeRemaining;
                        });
                    }
                }
            }
            self.findStatsForPlayer();
        };
        /****************************
         * PUBLIC METHODS DEFINITION
         ****************************/
        /**
         * quit the game
         *
         * @method   quit
         * @public
         */
        self.quit = function(){
            var _promise = self.Game.quit();

            if(_promise != null){
                _promise.then(function(){
                    self.Game.state = self.Game.ABANDONED;
                    self.goToState('wordshuffle','play','index');
                })
            }
        };

        /**
         * start new game
         *
         * @method   quit
         * @public
         */
        self.start = function(){
            self.toggleConfigModal = false;
            $(".modal-backdrop").hide();
            $(".modal.fade").hide();
            if(self.SysMan.state.action == 'index'){
                self.Game.newGame = true;
                self.goToState('wordshuffle','play','play');
            }
            else if(self.Game.status == self.Game.READY){
                self.Game.newGame = true;
                self.Game.save();
                self.Game.newGame = false;
            }
            else{
                self.SysMan.msg = {
                    text:   'Hold on click-happy, you have an active Game request awaiting processing',
                    type:   'INFO'
                };
            }
        };

        /**
         * @method   findStatsForPlayer             -- get Stats for logged in player
         * @public
         */
        self.findStatsForPlayer = function(){
            var _selectedRoundDuration = self.roundDuration;
                var _promiseStats = Stats.find();
                _promiseStats.then(
                    function (response) {
                        if (Stats.msg[0].text == 0) {
                            self.resetStats();
                        }
                        self.roundDuration = _selectedRoundDuration;
                        return response;
                    }
                );
        };

        /**
         * @method   resetStats         - Reset Stats when there is no record found for a player against particular duration.
         * @public
         */
        self.resetStats = function(){

            self.Stats.roundHigh = 0;
            self.Stats.roundAvg = 0;
            self.Stats.totalRounds = 0;
            self.Stats.avgPtsPerWord = 0;
            self.Stats.avgWordCount = 0;
            self.Stats.longestWord = 'No records!'
        };


        /**
         * @method   goToLoginPage      - Redirect user to login page
         * @public
         */
        self.goToLoginPage = function(){
            self.toggleConfigModal = false;
            $(".modal-backdrop").hide();
            $(".modal.fade").hide();
            self.goToState('wordshuffle','setup','index');
        };

        /******************
         * PROTECTED METHODS
         ******************/
        /**
         * @method   _onClose
         * Closure logic to implement on termination of the controller.  The ActionController superclass runs this
         * method against the current controller when the URL state transition dictates changing the controller.
         *
         * @protected
         * @param    newState   {{module:string,controller:string,action:string}}    The state replacing current state
         */
        self._onClose = function(newState){
            // nothing
        };

        // First extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController', {$scope: $scope, self: self});

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');

        self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');
    }

    // Explicitly define constructor
    WordShuffle_Controllers_Play.prototype.constructor = WordShuffle_Controllers_Play;

    WordShuffle_Controllers_Play.$inject = [
        '$scope',
        '$controller',
        'WordShuffle_Models_Game',
        'WordShuffle_Models_Player',
        'WordShuffle_Models_Player_Stats'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Play', WordShuffle_Controllers_Play);
})();