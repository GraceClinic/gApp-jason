(function () {

    /**
     * Controller factory returning an instance of the WordShuffle_Controller_Play controller.
     *
     * @class
     * @param   {App_Common_Abstracts_Controller}  Controller
     * @param   {WordShuffle_Models_Game}  Game         - singleton Game object, only one game active per player
     * @param   {WordShuffle_Models_Player}  Player     - singleton Player object, only one player across controllers
     * @param   {object}    $scope      - reference to angularjs controller scope
     * @returns {WordShuffle_Controllers_Play}
     */
    function WordShuffle_Controllers_PlayController($scope,Controller,Game,Player) {

        /**
         * Defines state control from the Play side of the site.
         *
         * @constructor
         * @extends     {App_Common_Abstracts_Controller}
         * @this        WordShuffle_Controllers_Play
         */
        function WordShuffle_Controllers_Play() {
            var self = this;		// required alias to address resolution to immediate scope
            self._isActionController = true;

            var _blockFetch = false;    // flag to block additional request to the backend when changing states

            /*****************
             * Public CONSTANTS
             ******************/
            // todo: use the "ng_const" live template to attach new constants on this controller

            /********************************
             * Public Properties declarations
             ********************************/
            // todo: use "ng_prop" live template to attach properties to this controller
            /**
             * @property    WordShuffle_Controllers_Play#Game      - active game object
             * @type        WordShuffle_Models_Game
             * @public
             **/
            Object.defineProperty(self,'Game',{get: getGame,set: setGame});
            /**
             * @property    WordShuffle_Controllers_Play#Player      - player object
             * @type        WordShuffle_Models_Player
             * @public
             **/
            Object.defineProperty(self,'Player',{get: getPlayer,set: setPlayer});

            /**********************************************
             * Controller Actions declarations / definition
             **********************************************/
            // todo:  use "ng_action" live template to insert individual actions (these are methods accessible through URL routes)
            /**
             * Logic following index action against the Play controller
             *
             * @method   indexAction
             * @public
             */
            self.indexAction = function(){
                // update the player and game information based on backend
                if(!_blockFetch){
                    Player.find();
                    var _promise = Game.find();

                    if(_promise !== null){
                        _promise.then(function(){
                            if(typeof Game.state == 'undefined' || Game.state == Game.COMPLETED){
                                self.msg = 'You do not have an active game!  Click "Play" if you wish to use your current settings to start a new one.'
                            }else{
                                if(Game.state == Game.IN_PROGRESS){
                                    self.goToState('wordshuffle','play','play');
                                }
                            }
                        });
                    }
                }else{
                    // reset flag for next action
                    _blockFetch = false;
                }
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
                }
                else if(self.Game.state == null || self.Game.state == self.Game.ABANDONED || self.Game.state == self.Game.COMPLETED){
                    self.goToState('wordshuffle','play','index');
                }
                else{
                    self.msg = 'You have an active game!  You cannot start another until this one is completed!';
                    // todo: update timer
                    var _start = new Date(self.Game.Rounds[self.Game.round-1].start);
                    var _now = new Date();
                    self.Game.Clock.start();
                    self.Game.Clock.now = (_now.getTime() - _start.getTime())/1000;

                }
            };

            /**********************************************
             * Controller Methods declarations / definition
             **********************************************/
            // todo:  use "ng_method" live template to insert individual controller methods (accessible through the controller's associated view)

            /**
             * quit the game
             *
             * @method   quit
             * @public
             */
            self.quit = function(){
                var _promise = self.Game.quit();

                if(_promise != null){
                    console.log('here');
                    _promise.then(function(){
                        self.goToState('wordshuffle','play','index');
                    })
                }

            };


            /*********************************
             * GETTERS AND SETTERS definitions
             ********************************/
            function getGame(){
                return Game;
            }
            function setGame(){
                self.SysMan.Logger.entry('Game.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
            }
            function getPlayer(){
                return Player;
            }
            function setPlayer(){
                self.SysMan.Logger.entry('Player.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
            }

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            Controller.call(self);
            self.scope = $scope;

            // todo: add constructor logic

        }

        // inherit prototype functions from superclass Controller
        WordShuffle_Controllers_Play.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Play.prototype.constructor = WordShuffle_Controllers_Play;

        // return new instance of this controller
        return new WordShuffle_Controllers_Play;
    }

    // todo:  inject other dependencies into the controller factory, and itemize in factory function above
    WordShuffle_Controllers_PlayController.$inject = ['$scope','App_Common_Abstracts_Controller','WordShuffle_Models_Game','WordShuffle_Models_Player'];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Play', WordShuffle_Controllers_PlayController);
})();
