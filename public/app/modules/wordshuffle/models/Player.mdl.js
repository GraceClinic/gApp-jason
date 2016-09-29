(function () {

    /**
     * Player factory returns a singleton instance of the Player object.  All controllers get the same object.
     *
     * @param {App_Common_Abstracts_Model}   Model
     * @returns {WordShuffle_Models_Player}
     * @constructor
     */
    function WordShuffle_Models_Player_Factory(Model) {
        /**
         * provide short description of model
         *
         * @class       WordShuffle_Models_Player
         * @extends     {App_Common_Abstracts_Model}
         * @returns     {WordShuffle_Models_Player}
         */
        function WordShuffle_Models_Player(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            // various flags for processing Player
            var _newName = false;           // flags entry of new name
            var _nameIsDefault = false;     // flags if name is Player default name
            var _saveMe = false;            // flags if Player object requires saving because of changes

            /********************************
             * Public Properties declarations
             ********************************/
            /**
             * @property    {string}    name    - player's name
             * @public
             */
            Object.defineProperty(self,"name",{get: getName,set: setName});
            /**
             * @property    WordShuffle_Models_Player#secret      - answer to secret question
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'secret',{get: getSecret,set: setSecret});
            /**
             * @property    WordShuffle_Models_Player#idChallenge      - the primary key for the challenge question
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'idChallenge',{get: getIdChallenge,set: setIdChallenge});
            /**
             * @property    WordShuffle_Models_Player#signInState      - flags if user requires login versus playing anonymously
             * @type        boolean
             * @public
             **/
            Object.defineProperty(self,'signInState',{get: getSignInState,set: setSignInState});
            /**
             * @property    WordShuffle_Models_Player#defaultName      - identifies default name for anonymous users
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'defaultName',{get: getDefaultName,set: setDefaultName});
            /**
             * @property    WordShuffle_Models_Player#challenges      - secret question choices
             * @type        array
             * @public
             **/
            Object.defineProperty(self,'challenges',{get: getChallenges,set: setChallenges});
            /**
             * @property    WordShuffle_Models_Player#challenge      - challenge question for the selected Player
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'challenge',{get: getChallenge});
            /**
             * @property    WordShuffle_Models_Player#secondsPerRound      - total time in a complete round as set in last game
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'secondsPerRound',{get: getSecondsPerRound,set: setSecondsPerRound});
            /**
             * @property    WordShuffle_Models_Player#roundsPerGame      - number of rounds in a complete game as set in last game
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'roundsPerGame',{get: getRoundsPerGame,set: setRoundsPerGame});
            /**
             * @property    WordShuffle_Models_Player#saveIsPending      - flags if Player object requires save
             * @type        boolean
             * @public
             **/
            Object.defineProperty(self,'saveIsPending',{get: getSaveIsPending});

            /**
             * @property    acceptedTOS
             * this is a check for letting a person play
             *
             * @type    {boolean}
             * @public
             **/
            Object.defineProperty(self,'acceptedTOS',{get: getAcceptedTOS, set: setAcceptedTOS, enumerable:true});

            
            /**
             * @method   authenticateUser
             * authenticate the user if he/she is trying to change his/her profile configs
             *
             * @public
             * @return   {boolean}
             */
            self.authenticateUser = function(){
                var _promise = self.relay("login");
                _promise.then(
                    function(response) {
                        if (parseInt(self.signInState) === self.SysMan.SIGNED_IN) {
                            //console.log("secret validated, please write the next action");
                        }
                        else if (parseInt(self.signInState) === self.SysMan.SIGNED_IN_EDIT_NOT_ALLOWED) {
                            //console.log("entered wrong secret, not allowed");
                        }
                        else {
                            //console.log("something else is wrong, signInState", self.signInState);
                        }
                    }
                );

            };

            /**
             * @method   editProfile
             * action for editProfile
             *
             * @public                      - todo: scope as public or protected, prefix name with "_" for protected
             * @param    {}                 - todo: document each parameter
             * @return   {boolean}
             */
            self.editProfile = function(){
                // todo: code method
                return true;
            };

            

            /**
             * Submits request to login with Player name
             *
             * @method   login
             * @public
             * @return   {boolean}
             */
            self.login = function(){
                // login should not be called in anonymous state
                var _promise = {}
                if(self.signInState){
                    //clear current messages
                    self.msg = [];
                    _promise = self.relay('login');
                }
                return _promise;
            };

            /**
             * Runs logic after login() method returns from backend
             *
             * @method  _postLogin
             * @protected
             */
            self._postLogin = function(){
                if(self.signInState == self.SysMan.SIGNED_IN){
                    // clear secret field
                    self.secret = '';
                }

            };

            /**
             * Clears player session information
             *
             * @method   logout
             * @public                      - todo: change scoping of method as appropriate, for protected methods, prefix with "_"
             * @return   {promise}
             */
            self.logout = function(){
                _resetFlags();
                var _promise = self.remove();
                _promise.then(
                    function(response){
                        self.msg = {"text":"Player logout successful!","type":'info'};
                        self.name = self.defaultName;
                        self.id = 0;
                        return response;
                    });

                return _promise;
            };
            

            /**
             * Validates player state and adjusts as necessary
             *
             * @function    _validateState
             * @private
             */
            function _validateState(){
                switch(self.signInState){
                    case self.SysMan.ANONYMOUS_PLAY:
                        // toggle state if user selected a new name
                        if(_newName && !_nameIsDefault){
                            // if id not set and user changes name, request login
                            self.signInState = self.SysMan.NAME_PENDING;
                        }
                        break;
                    case self.SysMan.NAME_PENDING:
                        // toggle state if user selected a new name
                        if(_nameIsDefault){
                            // if id not set and user changes name, request login
                            self.signInState = self.SysMan.ANONYMOUS_PLAY;
                        }
                        break;
                    case self.SysMan.NEW_SIGN_IN:
                        //step backwards in process if user changed name while pending New_Sign_In in progress
                        if(_newName && !_nameIsDefault){
                            // if id not set and user changes name, request login
                            self.signInState = self.SysMan.NAME_PENDING;
                        }else{
                            self.signInState = self.SysMan.ANONYMOUS_PLAY;
                        }
                        break;
                    case self.SysMan.SECRET_PENDING:
                        if(_newName && !_nameIsDefault){
                            // if id not set and user changes name, request login
                            self.signInState = self.SysMan.NAME_PENDING;
                        }else{
                            self.signInState = self.SysMan.ANONYMOUS_PLAY;
                        }
                        break;
                    case self.SysMan.SIGNED_IN:
                        // do as you like, player name change will validate if it is available
                        break;
                    case self.SysMan.NAME_PENDING_REGISTER:
                        //this state should only be checked in the backend, but after you have a keyUp event registered
                        //on player name, if the requested user name for registration is already present. first keyup method is getting called and then setName,
                        //and now as there is no case this state, it makes it anonymous.
                        self.signInState = self.SysMan.NEW_SIGN_IN
                        break;
                    case self.SysMan.NAME_NOT_AVAILABLE:
                        //do nothing, let it be same
                        break;
                    default:
                        // typically hit this state during first load from backend before all properties set
                        self.signInState = self.SysMan.ANONYMOUS_PLAY;
                }
            }

            /**
             * Clears all state tracking flags
             *
             * @function    _resetFlags
             * @private
             */
            function _resetFlags(){
                _newName = false;
                _nameIsDefault = false;
                _saveMe = false;
                self.signInState = self.SysMan.ANONYMOUS_PLAY;
            }

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _name = '';
            function getName(){
                return _name;
            }
            function setName(value){
                _newName = value !== '' && value !== _name;
                _nameIsDefault = value == self.defaultName;
                if(_newName){
                    // clear the secret entry
                    self.secret = '';
                    // flag saveMe only after return from backend (this is when user makes the changes)
                    if(self.status == self.READY){
                        _saveMe = true;
                    }
                }
                if(value == self.defaultName)
                    _name = '';
                else
                    _name = value;
                _validateState();
            }
            var _secret = '';
            function getSecret(){
                return _secret;
            }
            function setSecret(value){
                if(_secret !== value){
                    _secret = value;
                    _saveMe = true;
                }
            }
            var _idChallenge;
            function getIdChallenge(){
                return _idChallenge;
            }
            function setIdChallenge(value){
                _idChallenge = value;
            }
            var _signInState = false;
            function getSignInState(){
                return _signInState;
            }
            function setSignInState(value){
                _signInState = value;
            }
            var _defaultName = '';
            function getDefaultName(){
                return _defaultName;
            }
            function setDefaultName(value){
                // only set once (based on first call to backend)
                if(_defaultName == ''){
                    _defaultName = value;
                }
            }
            var _challenges = [];
            function getChallenges(){
                return _challenges;
            }
            function setChallenges(value){
                _challenges = value;
            }
            function getChallenge(){
                // get the specific challenge question for the player from the list of possible challenge questions
                if(self.challenges.length > 0){
                    for (var i=0; i<self.challenges.length; i++) {
                        if (self.challenges[i].id == self.idChallenge) return self.challenges[i].question;
                    }
                }
            }
            var _secondsPerRound;
            function getSecondsPerRound(){
                return _secondsPerRound;
            }
            function setSecondsPerRound(value){
                _secondsPerRound = value;
            }
            var _roundsPerGame;
            function getRoundsPerGame(){
                return _roundsPerGame;
            }
            function setRoundsPerGame(value){
                _roundsPerGame = value;
            }
            function getSaveIsPending(){
                return _saveMe;
            }

            var _acceptedTOS = false;
            function getAcceptedTOS(){
                return _acceptedTOS;
            }
            function setAcceptedTOS(value){
                //_acceptedTOS = value ? 1 : 0;
                _acceptedTOS = value;
            }

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START ' + self.constructor.name+'.construct()',self.constructor.name);
            Model.call(self,data);

            self._rootURL = '/WordShuffle/Player/';

            self.excludeFromPost(['defaultName','challenges','saveIsPending']);

            self.SysMan.Logger.entry('END ' + self.constructor.name+'.construct()',self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        WordShuffle_Models_Player.prototype = Object.create(Model.prototype);
        WordShuffle_Models_Player.prototype.constructor = WordShuffle_Models_Player;


        /***************************************************
         * MODEL PROTOTYPE METHODS DECLARATION / DEFINITION
         ***************************************************/
        /**
         * Logic executed after find event returns
         *
         * @method   _postFind
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Player.prototype._postFind = function() {
            return true;
        };

        WordShuffle_Models_Player.prototype.save = function(){
            // preform presave logic then run run superclass save
            //if(this.signInState < this.SysMan.NAME_PENDING){
            //    // form submit means play game anonymously
            //}else{
            //    console.log('player.save');
            //    Model.prototype.save.call(this);
            //}
            Model.prototype.save.call(this);
        };

        /**
         * Logic executed after save returns
         *
         * @method   _postSave
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Player.prototype._postSave = function(){
            if(this.signInState == this.SysMan.SIGNED_IN){
                // clear secret field
                this.secret = '';
            }
            return true;
        };

        /**
         * Logic to apply before any dispatch to the backend
         *
         * @method   _preDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Player.prototype._preDispatch = function(){
            // clear any current Player messages, then run superclass save
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
        WordShuffle_Models_Player.prototype._postDispatch = function(){
            // clear any current Player messages, then run superclass save
            this.secret = "";
            return true;
        };

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new WordShuffle_Models_Player;
    }

    WordShuffle_Models_Player_Factory.$inject = [
        'App_Common_Abstracts_Model'
    ];

    angular.module('App_WordShuffle').factory('WordShuffle_Models_Player', WordShuffle_Models_Player_Factory);
})();
