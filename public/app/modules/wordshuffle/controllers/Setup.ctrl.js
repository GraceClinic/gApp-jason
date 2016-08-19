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
            self.Player.find();
            if(Game.state == Game.IN_PROGRESS){
                self.goToState('wordshuffle','play','play');
            }
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
         * @method   registerUser
         * checks userName name available or not
         *
         * @public                      - todo: scope as public or protected, prefix name with "_" for protected
         * @param    {}                 - todo: document each parameter
         * @return   {boolean}
         */
        self.registerUser = function(){
            console.log("register user called");
            Player.login();
            $state.go('module.controller.action', {module: "wordshuffle", controller: "setup", action: "registration"});
            // todo: code method
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