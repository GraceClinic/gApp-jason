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
         * @property    tempUserName
         * this is to create one-way binding from <input... username> to Setup.Player.name, or else default name appears
         *
         * @type    {text}
         * @public
         **/
        Object.defineProperty(self,'tempUserName',{get: getTempUserName, set: setTempUserName, enumerable:true});
        var _tempUserName;
        function getTempUserName(){
            return _tempUserName;
        }
        function setTempUserName(value){
            _tempUserName = value;
        }
        
        // todo: use ng_prop to create complete properties, otherwise create simply, uncontrolled properties off of self

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
            // todo: define any parameters and then code action logic
            console.log("before find, signIn State", self.Player.signInState);
            if (self.Player.signInState !== self.SysMan.SIGNED_IN) {
                var _promise = self.Player.find();
                _promise.then(
                    function(response) {
                        if (self.Player.signInState !== self.SysMan.SIGNED_IN) {
                            Player.name = "";
                        }
                    },function (reason) {
                        console.log("sorry your find failed - reason",reason);
                    }
                );
            }
            if(Game.state == Game.IN_PROGRESS){
                self.goToState('wordshuffle','play','play');
            }
        };
        
        /**
         * @method   loginAction
         * this is the loginAction for you
         *
         * @public                  
         * @param 
         * @return   {}
         */
        self.loginAction = function(){
            // todo: code method
            self.Player.find();
        };
        

        /**
         * @method   editProfile
         * this will enable you to edit the user profile of already registered users
         *
         * @public 
         * @return   {void}
         */
        self.editProfileAction = function(){
            console.log("inside editProfile", self.Player.signInState, self.Player);
        };
        
        self.goToEdit = function () {
            console.log("log before going to editProfile, signInState", self.Player.signInState);
            self.Player.signInState = self.SysMan.SIGNED_IN_EDITING; // editing profile
            console.log("log before setting, signInState", self.Player.signInState);
            $state.go('module.controller.action', {module: "wordshuffle", controller: "setup", action: "editProfile"});
        }

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
            console.log("saveIsPending, signInState, SIGNED_IN", self.Player.saveIsPending, self.Player.signInState, self.SysMan.SIGNED_IN);
            if(self.Player.saveIsPending && self.Player.signInState < self.SysMan.SIGNED_IN){
                self.Player.login();
            }
            else if(self.Player.saveIsPending){
                self.Player.save();
                self.Player.saveIsPending = false;
                // routing to play controller / play action will start the game
                Game.newGame = true;
                self.goToState('wordshuffle','play','play');
            }
            else{
                Game.newGame = true;
                self.goToState('wordshuffle','play','play');
            }
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
         * Proxy Player.save() method.  Resets "showSecret" property before execution of save.
         *
         * @method   savePlayer
         * @public                     - define scope
         */
        self.savePlayer = function(){
            self.showSecret = false;
            self.Player.save();
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
         * @method   goToIndex
         * sets signIn state to 0 an brings back to the index page
         *
         * @public
         * @return   {void}
         */
        self.goToIndex = function(){
            // todo: code method
            // self.Player.name = "Player";
            self.Player.signInState = self.SysMan.SIGNED_IN;

            $state.go('module.controller.action', {module: "wordshuffle", controller: "setup", action: "index"})
        };

        /**
         * @method   saveProfileChanges
         * if the profile is edited, save it to the backend, but how to check? todo: find out!
         *
         * @public
         * @return   {}
         */
        self.saveProfileChanges = function(){
            // todo: code method
            self.Player.save();
        };

        
        /**
         * @method   registerUser
         * checks userName name available or not
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {boolean}
         */
        self.registerUser = function(){
            // if ($scope.loginRegisterForm.$valid) {
            //     alert('our form is amazing');
            // }
            //Player.actionState = "register";
            //$scope doesn't get the form?? and shouldn't but how are they getting at : http://codepen.io/sevilayha/pen/xFcdI ??
            //Player.name = self.tempUserName;
            if (self.Player.signInState === self.SysMan.NAME_PENDING) {
                self.Player.signInState = self.SysMan.NAME_PENDING_REGISTER;
            }
            console.log("clicking register", self.Player.signInState);
            Player.login();
            $state.go('module.controller.action', {module: "wordshuffle", controller: "setup", action: "registration"});
            // todo: code method
        };

        /**
         * @method   loginUser
         * calls methos login, sets actionState to login
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {void}
         */
        self.loginUser = function(){
            if (self.Player.signInState === self.SysMan.NAME_PENDING) {
                self.signInState = self.SysMan.NAME_PENDING_LOGIN;
            }
            Player.login();
            $state.go('module.controller.action', {module: "wordshuffle", controller: "setup", action: "login"});
        };

        /**
         * @method   acceptTerms
         * accept terms of play
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {void}
         */
        self.acceptTerms = function(){
            //Player.actionState = "anonymous";
            console.log("player name", Player.name);
            Player.login();
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