
(function(){
    /**
     * Welcome controller constructor
     *
     * @constructor
     * @extends         {App_Common_Abstracts_ActionController}
     * @param   {object}    $scope      - local angular scope for this controller
     * @param   {function}    $controller - angular controller service responsible for instantiating controllers
     * @param   {WordShuffle_Models_Game}   Game    - singleton Game object, only one game active per player
     * @param   {function(new:WordShuffle_Models_Instructions)}   Instructions    - constructor for game Instructions object
     * @param   {App_Common_Models_Message}       Message     - constructor for Message object
     * @this    WordShuffle_Controllers_Welcome
     */
    function WordShuffle_Controllers_Welcome($scope,$controller,Game,Instructions,Message){
        var self = this;

        /*************************************************
         * PROPERTY DECLARATIONS with GETTERS and SETTERS
         *************************************************/
        /**
         * @property    WordShuffle_Controllers_Welcome#Instructions      - instructions for playing WordShuffle
         * @type        WordShuffle_Models_Instructions
         * @public
         **/
        Object.defineProperty(self,'Instructions',{get: getInstructions,set: setInstructions,enumerable:true});
        function getInstructions(){
            return Instructions;
        }
        function setInstructions(){
            self.SysMan.Logger.entry(
                'Welcome.Instructions.set not ALLOWED!',
                self.constructor.name,
                self.SysMan.Logger.TYPE.ERROR,
                self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        /******************
         * ACTION METHODS
         ******************/
        /**
         * @method indexAction
         * Provides logic associated with index action.  Currently, that means redirection to the "play" state if the user has an active game.
         *
         * @public
         */
        self.indexAction = function(){
            if(Game.state == Game.IN_PROGRESS){
                self.goToState('wordshuffle','play','play');
            }
        };

        // Extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController',{$scope: $scope, self: self});

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()','App_Common_Abstracts_ActionController');

        // clear any messages left over from previous controllers
        var i = self.msg.length;
        while(i > 0){
            self.msg.shift();
            i--;
        }
        self.msg = {text:'Welcome to WordShuffle!',type:Message.prototype.TYPES.INFO};
        self.msg = {
            text:   "Please read the instructions and learn more about this exciting game!",
            type:   Message.prototype.TYPES.INFO
        };

        self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()','App_Common_Abstracts_ActionController');

    }
    // Explicitly define constructor
    WordShuffle_Controllers_Welcome.prototype.constructor = WordShuffle_Controllers_Welcome;

    // inject dependenciesObject
    WordShuffle_Controllers_Welcome.$inject = [
        '$scope',
        '$controller',
        'WordShuffle_Models_Game',
        'WordShuffle_Models_Instructions',
        'App_Common_Models_Message'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Welcome',WordShuffle_Controllers_Welcome);
})();
