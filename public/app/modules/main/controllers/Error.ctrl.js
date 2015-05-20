(function () {
    /**
     * Default application wide error controller.  Displays content of Logger stack.
     *
     * @constructor
     * @extends         {App_Common_Abstracts_ActionController}
     * @param   {object}      $scope      - local angular scope for this controller
     * @param   {function}    $controller - angular controller service responsible for instantiating controllers
     * @param   {App_Common_Models_SysMan}  SysMan  - reference to the SysMan singleton
     * @this    Main_Controllers_Error
     */
    function Main_Controllers_Error($scope, $controller, SysMan) {
        var self = this;

        /****************************
         * ACTION METHODS DEFINITION
         ****************************/
        /**
         * Default error action, displays Logger stack information
         *
         * @method   errorAction
         * @public
         */
        self.errorAction = function(){
            // nothing so far
        };

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');

        // First extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController', {$scope: $scope, self: self});

        // set the state variables explicitly since this is a fallback Error controller
        SysMan.state = {
            "module": 'main',
            "controller": 'error',
            "action": 'error'
        };

        SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', 'App_Common_Abstracts_ActionController');
    }

    // Explicitly define constructor
    Main_Controllers_Error.prototype.constructor = Main_Controllers_Error;

    // todo: inject dependencies as required
    Main_Controllers_Error.$inject = [
        '$scope',
        '$controller',
        'App_Common_Models_SysMan'
    ];

    angular.module('App_Main').controller('Main_Controllers_Error', Main_Controllers_Error);
})();