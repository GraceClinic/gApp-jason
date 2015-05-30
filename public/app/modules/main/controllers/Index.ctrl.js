(function () {
    // todo: document new parameters as required and provide short description
    /**
     * @class Main_Controllers_Index
     * << short description >>
     *
     * @extends         {App_Common_Abstracts_ActionController}
     * @param   {object}      $scope      - local angular scope for this controller
     * @param   {function}    $controller - angular controller service responsible for instantiating controllers
     * @this    Main_Controllers_Index
     */
    function Main_Controllers_Index($scope, $controller) {
        var self = this;

        /**
         * @method   indexAction
         * Empty shell, so far no extra logic associated with this action
         *
         * @public
         */
        self.indexAction = function(){
            // nothing so far
        };

        // First extend ActionController superclass as allowed for by AngularJS.
        // This must execute after definitions of all controller properties, setters, getters, and methods
        $controller('App_Common_Abstracts_ActionController', {$scope: $scope, self: self});

        /*********************
         * CONSTRUCTOR LOGIC
         *********************/
        self.SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', self.constructor.name);


        self.SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);
    }

    // Explicitly define constructor
    Main_Controllers_Index.prototype.constructor = Main_Controllers_Index;

    Main_Controllers_Index.$inject = [
        '$scope',
        '$controller'
    ];

    angular.module('App_Main').controller('Main_Controllers_Index', Main_Controllers_Index);
})();