(function () {

    /**
     * Factory function for instantiation of the Setup Controller.
     *
     * @class
     * @param   {App_Common_Abstracts_Controller}  Controller
     * @param   {WordShuffle_Models_Game}  Game         - singleton Game object, only one game active per player
     * @param   {WordShuffle_Models_Player}  Player     - singleton Player object, only one player across controllers
     * @param   {object}    $scope      - reference to angularjs controller scope
     * @returns {WordShuffle_Controllers_Setup}
     */
    function WordShuffle_Controllers_SetupController($scope,Controller,Game,Player) {

        /**
         * Controls authentication and setup of game defaults for next play.
         *
         * @constructor
         * @extends     {App_Common_Abstracts_Controller}
         * @this        WordShuffle_Controllers_Setup
         */
        function WordShuffle_Controllers_Setup() {
            var self = this;		// required alias to address resolution to immediate scope
            self._isActionController = true;

            /********************************
             * Public Properties declarations
             ********************************/
            /**
             * @property    WordShuffle_Controllers_Setup#Game      - player's game object
             * @type        WordShuffle_Models_Game
             * @public
             **/
            Object.defineProperty(self,'Game',{get: getGame,set: setGame});
            /**
             * @property    WordShuffle_Controllers_Setup#Player      - player details
             * @type        WordShuffle_Models_Player
             * @public
             **/
            Object.defineProperty(self,'Player',{get: getPlayer,set: setPlayer});
            /**
             * @property    WordShuffle_Controllers_Setup#showSecret      - hide/show secret fields
             * @type        boolean
             * @public
             **/
            Object.defineProperty(self,'showSecret',{get: getShowSecret,set: setShowSecret});
            /**
             * @property    WordShuffle_Controllers_Setup#minutesPerRound      - translate minutes to Player->secondsPerRound
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'minutesPerRound',{get: getMinutesPerRound,set: setMinutesPerRound});

            /**********************************************
             * Controller Actions declarations / definition
             **********************************************/
            /**
             * User indexes the setup state
             *
             * @method   indexAction
             * @public
             */
            self.indexAction = function(){
                // todo: define any parameters and then code action logic
                self.Player.find();
            };

            /**********************************************
             * Controller Methods declarations / definition
             **********************************************/
            /**
             * Submits form content to backend
             *
             * @method   playGame
             * @public
             * @return   {bool}
             */
            self.playGame = function(){
                if(self.Player.saveIsPending){
                    self.Player.save();
                    self.Player.saveIsPending = false;
                }
                //self.Game.roundsPerGame = self.Player.roundsPerGame;
                //self.Game.secondsPerRound = self.Player.secondsPerRound;
                //self.Game.idPlayer = self.Player.id;
                //self.Game.save();

                // routing to play controller / play action will start the game
                self.goToState('wordshuffle','play','play');
            };
            /**
             * Toggles display of secret fields when the Player is signed-in
             *
             * @method   toggleShowSecret
             * @public                      - todo: change scoping of method as appropriate, for protected methods, prefix with "_"
             */
            self.toggleShowSecret = function(){
                self.showSecret = !self.showSecret;
            };
            /**
             * Proxy Player.save so controller can respond to save event.
             *
             * @method   savePlayer
             * @public                     - define scope
             */
            self.savePlayer = function(){
                self.showSecret = false;
                self.Player.save();
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
            //var _Player = new Player;
            //_Player.msg = [];
            Player.msg = [];
            function getPlayer(){
                return Player;
            }
            function setPlayer(){
                self.SysMan.Logger.entry('Player.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
            }
            var _showSecret = false;
            function getShowSecret(){
                return _showSecret;
            }
            function setShowSecret(value){
                _showSecret = value;
            }
            function getMinutesPerRound(){
                return self.Player.secondsPerRound/60;
            }
            function setMinutesPerRound(value){
                self.Player.secondsPerRound = value*60;
            }
            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            Controller.call(self);
            self.scope = $scope;

        }

        // inherit prototype functions from superclass Controller
        WordShuffle_Controllers_Setup.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Setup.prototype.constructor = WordShuffle_Controllers_Setup;

        // return new instance of this controller
        return new WordShuffle_Controllers_Setup;
    }

    // todo:  inject other dependencies into the controller factory, and itemize in factory function above
    WordShuffle_Controllers_SetupController.$inject = ['$scope','App_Common_Abstracts_Controller','WordShuffle_Models_Game','WordShuffle_Models_Player'];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Setup', WordShuffle_Controllers_SetupController);
})();
