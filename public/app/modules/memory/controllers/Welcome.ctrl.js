
(function(){
    /**
     * Welcome controller constructor
     *
     * @constructor
     * @extends         {App_Common_Abstracts_ActionController}
     * @param   {object}    $scope      - local angular scope for this controller
     * @param   {function}    $controller - angular controller service responsible for instantiating controllers
     * @param   {App_Common_Models_Message}       Message     - constructor for Message object
     * @this    Memory_Controllers_Welcome
     */
    function Memory_Controllers_Welcome($scope,$controller,Message){
        var self = this;

        /*************************************************
         * PROPERTY DECLARATIONS with GETTERS and SETTERS
         *************************************************/

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

        };

        /******************
         * PROTECTED METHODS
         ******************/
        /**
         * @method   _onClose
         * Closure logic to implement on termination of the controller
         *
         * @protected
         * @param    newState   {{module:string,controller:string,action:string}}    The state replacing current state
         */
        self._onClose = function(newState){

        };

        // Extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController',{$scope: $scope, self: self});

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()','App_Common_Abstracts_ActionController');

        self.msg = {text:'Welcome to Memory!',type:Message.prototype.TYPES.INFO};

        self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()','App_Common_Abstracts_ActionController');

    }
    // Explicitly define constructor
    Memory_Controllers_Welcome.prototype.constructor = Memory_Controllers_Welcome;

    // inject dependenciesObject
    Memory_Controllers_Welcome.$inject = [
        '$scope',
        '$controller',
        'App_Common_Models_Message'
    ];

    angular.module('App_Memory').controller('Memory_Controllers_Welcome',Memory_Controllers_Welcome);
})();
