(function () {

    /**
     * Controller for authentication and configuration of game defaults
     *
     * @constructor
     * @extends {App_Common_Abstracts_ActionController}
     * @param   {object}        $scope      - local angular scope for this controller
     * @param   {function}      $controller - angular controller service responsible for instantiating controllers
     * @param   {function}      $state      - ui.router state service for state routing
     * @param   {WordShuffle_Models_Game}   Game        - singleton Game object, only one game active per player
     * @param   {WordShuffle_Models_Player} Player      - singleton Player object, only one player across controllers
     * @param   {App_Common_Models_Message} Message     - constructor for Message object
     */
    function WordShuffle_Controllers_Setup($scope, $controller, $state, Game, Player, Message) {
        var self = this;
        var _flag = false;
        /*************************************************
         * PROPERTY DECLARATIONS with GETTERS and SETTERS
         *************************************************/
        /**
         * @property    WordShuffle_Controllers_Setup#Player      - player details
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
         * @property    WordShuffle_Controllers_Setup#Game
         * @type    {WordShuffle_Models_Game}
         * @public
         **/
        Object.defineProperty(self,'Game',{get: getGame, set: setGame, enumerable:true});
        var _Game;
        function getGame(){
            return Game;
        }
        function setGame(value){
            self.SysMan.Logger.entry('Game.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        Object.defineProperty(self,'showSecret',{get: getShowSecret,set: setShowSecret});
        /**
         * @property    WordShuffle_Controllers_Setup#showSecret      - hide/show secret fields
         * @type        boolean
         * @public
         **/
        var _showSecret = false;
        function getShowSecret(){
            // if user not signed-in, revert to false
            if(Player.signInState !== self.SysMan.SIGNED_IN){
                _showSecret = false;
            }
            return _showSecret;
        }
        function setShowSecret(value){
            _showSecret = value;
        }
        /**
         * @property    WordShuffle_Controllers_Setup#minutesPerRound      - translate minutes to Player->secondsPerRound
         * @type        int
         * @public
         **/
        Object.defineProperty(self,'minutesPerRound',{get: getMinutesPerRound,set: setMinutesPerRound});
        function getMinutesPerRound(){
            return self.Player.secondsPerRound/60;
        }
        function setMinutesPerRound(value){
            self.Player.secondsPerRound = value*60;
        }

        /**
         * @property    WordShuffle_Controllers_Setup#isTOSaccepted         - set/unset flag based on the TOS accepted
         * @type    {boolean}
         * @public
         **/
        Object.defineProperty(self,'isTOSaccepted',{get: getIsTOSaccepted, set: setIsTOSaccepted});
        var _isTOSaccepted;
        function getIsTOSaccepted(){
            return _isTOSaccepted;
        }
        function setIsTOSaccepted(value){
            _isTOSaccepted = value;
        }

        /**
         * @property    WordShuffle_Controllers_Setup#isPlayerNameExists        - check if Player name exists an set/unset the flag
         * @type    {boolean}
         * @public
         **/
        Object.defineProperty(self,'isPlayerNameExists',{get: getIsPlayerNameExists, set: setIsPlayerNameExists});
        var _isPlayerNameExists = false;
        function getIsPlayerNameExists(){
            return _isPlayerNameExists;
        }
        function setIsPlayerNameExists(value){
            _isPlayerNameExists = value;
        }


        /****************************
         * ACTION METHODS DEFINITION
         ****************************/
        /**
         * User indexes the setup state
         *
         * @method   indexAction
         * @public
         */
        self.indexAction = function(){
            if(_flag == true) {
                if (self.Player.id !== 0) {
                    self.Player.logout()
                        .then(
                            function (response) {
                                if (self.Player.signInState == self.SysMan.ANONYMOUS_PLAY) {
                                    self.Player.name = '';
                                }
                            }
                        );
                }
                else{
                    self.Player.signInState = self.SysMan.ANONYMOUS_PLAY;
                    self.Player.name = '';
                    self.Player.tos=false;
                }
                _flag = false;
            }
            else {
                var _promise = self.Player.find();
                _promise.then(
                    function (response) {
                        if (self.Player.signInState == self.SysMan.ANONYMOUS_PLAY) {
                            self.Player.name = '';
                        }
                    }
                );
                if (Game.state == Game.IN_PROGRESS) {
                    self.goToState('wordshuffle', 'play', 'play');
                }
            }
        };

        /**
         * @method   loginAction
         * Takes user to login page
         * @public
         * @param    {}
         */
        self.loginAction = function(){
            self.Player.login();
        };
        
        /**
         * @method   registrationAction
         * Takes user to registration page
         * @public
         * @param    {}
         */
        self.registrationAction = function(){
            var playerName = self.Player.name;
            self.Player.login()
                .then(
                function (response) {
                    for (var i = 0; i < self.Player.msg.length; i++) {
                        if (self.Player.msg[i].text == self.Player.WELCOME_BACK_MSG) {
                            self.Player.logout()
                                .then(
                                    function (response) {
                                        self.Player.name = playerName;
                                        self.Player.msg.push({type:"danger", text:self.Player.WELCOME_BACK_MSG});
                                    }
                                );
                        }
                    }
                }
            );
        };
        
        /****************************
         * PUBLIC METHODS DEFINITION
         ****************************/
        /**
         * Submits form content to backend
         *
         * @method   playGame
         * @public
         * @return   {bool}
         */
        self.playGame = function(){
            if(self.Player.signInState < self.SysMan.SIGNED_IN){
                self.Player.signInState = self.SysMan.ANONYMOUS_PLAY;
            }
            if(self.Player.signInState == self.SysMan.SIGNED_IN) {
                self.isTOSaccepted = self.Player.tos;
            }
                self.Player.save();
                Game.newGame = true;
                self.goToState('wordshuffle','play','play');
        };

        /**
         * Toggles display of secret fields when the Player is signed-in
         *
         * @method   toggleShowSecret
         * @public                      - todo: change scoping of method as appropriate, for protected methods, prefix with "_"
         *
        self.toggleShowSecret = function(){
            self.showSecret = !self.showSecret;
        };*/

        /**
         * Proxy Player.save() method.  Resets "showSecret" property before execution of save.
         *
         * @method   savePlayer
         * @public                     - define scope
         */
        self.savePlayer = function(){
            var _flagLoginFail = false;
                var _promise = self.Player.save();
                _promise.then(
                    function (response) {
                        for (var i = 0; i < self.Player.msg.length; i++) {
                            if (self.Player.msg[i].text == self.Player.LOGIN_FAILURE) {
                                _flagLoginFail = true;
                                break;
                            }
                        }
                        //If secret rejected, stay on login page
                        if (_flagLoginFail) {
                            self.isTOSaccepted = self.Player.tos;
                            self.goToState('wordshuffle', 'setup', 'login');
                        }
                        return response;
                    });
                self.isTOSaccepted = self.Player.tos;
                self.goToState('wordshuffle', 'setup', 'index');
                return _promise;
        };

        /**
         * @method   registerNewPlayer
         * submit new player details and save if valid
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {}
         */
        self.registerNewPlayer = function(){
            var _playerExists = false;
            var _setSecret = self.Player.secret;
            var _promise = self.Player.nameExists();
            _promise.then(
                function (response) {
                    for (var i = 0; i < self.Player.msg.length; i++) {
                        if (self.Player.msg[i].text == self.Player.PLAYER_NAME_EXIST) {
                            _playerExists = true;
                            break;
                        }
                    }
                    if(!_playerExists) {
                        self.Player.id = 0;
                        self.Player.secret = _setSecret;
                        self.Player.signInState = self.SysMan.NEW_SIGN_IN;
                        self.savePlayer();
                    }
                    return response;
                });
        };


        /**
         * Proxy Player.logout so controller can respond to successful logout.
         *
         * @method   playerLogout
         * @public
         */
        self.playerLogout = function(){
            var _newState = {
                "module":       'wordShuffle',
                "controller":   'setup',
                "action":       'index'
            };

            var _promise = self.Player.logout();

            if(_promise !== null){
                _promise.then(function(response){
                    // refresh page to load the anonymous player information
                    if(response.data.results == true){
                        $state.go('module.controller.action',_newState,{reload:true});
                    }else{
                        self.msg = {
                            text:   "Oops, logout occurred, but there was an issue!",
                            type:   Message.prototype.TYPES.INFO
                        };
                    }
                });
            }
        };


        /**
         * @method   goBackPreviousScreen
         *
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {}
         */
        self.goBackPreviousScreen = function(){
            _flag = true;
            self.goToState('wordshuffle','setup','index');
        };

        /**
         * @method   RegisterNewPlayer
         *
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {}
         */
        self.RegisterNewPlayer = function(){
            self.goToState('wordshuffle','setup','registration');
        };

        /**
         * @method   PlayerLogin
         *
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {}
         */
        self.PlayerLogin = function(){
            self.goToState('wordshuffle','setup','login');
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

        // Extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController', {$scope: $scope, self: self});

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        
        self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');

        self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');
    }

    // Explicitly define constructor
    WordShuffle_Controllers_Setup.prototype.constructor = WordShuffle_Controllers_Setup;

    // todo: inject dependencies as required
    WordShuffle_Controllers_Setup.$inject = [
        '$scope',
        '$controller',
        '$state',
        'WordShuffle_Models_Game',
        'WordShuffle_Models_Player',
        'App_Common_Models_Message'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Setup', WordShuffle_Controllers_Setup);
})();