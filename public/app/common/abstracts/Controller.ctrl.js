/**
 * File: Controller
 * User: jderouen
 * Date: 1/12/15
 * Time: 12:47 PM
 */
(function(){

    /**
     *
     * @param {App_Common_Models_SysMan} SysMan
     * @param $stateParams  - ui.router state parameters from URL:  module, controller, action
     * @param $state        - ui.router state variable for routing to new state
     * @param $rootScope    - link to angularjs root scope for listening to state changes
     */
    function App_Common_Abstracts_ControllerFactory(SysMan,$stateParams,$state,$rootScope){
        // private variables serving prototype
        var _paramPresent = ($stateParams !== null) && ($stateParams instanceof Object);

        /**
         * Controller superclass, serves as the base for all angularjs controllers.  Sets controller name and triggers
         * action based on URL parameters passed to controller
         *
         * @class       App_Common_Abstracts_Controller
         * @extends     Function
         * @returns     {App_Common_Abstracts_Controller}
         */
        function App_Common_Abstracts_Controller(){
            var self = this;
            /**
             * Identifies controller is responsible for watching URL parameters and executing specific action as
             * specified by the parameters.
             *
             * @type {boolean}
             * @protected
             */
            self._isActionController;

            // register listener to rootScope for reacting to state changes and store to clean up function for trash collection
            var _cleanUp = $rootScope.$on('$stateChangeSuccess', function(event,toState,toParams,fromState,fromParams){
                self.processStateChange(toParams,fromParams,false);
            });

            // private class variables
            var _constructorSet = self.constructor.name !== 'Controller' && self.constructor.name !== 'Object';
            var _errMsg = '';

            /********************************
             * PUBLIC PROPERTIES DECLARATION
             ********************************/
            /**
             * @property    {string}    msg     - active message to display to user, array storage allows for holding more than one
             * @public
             */
            Object.defineProperty(self,'msg',{get: getMsg,set: setMsg});
            /**
             * @property    App_Common_Abstracts_Controller#scope      - reference to specific controller's scope
             * @type        object
             * @public
             **/
            Object.defineProperty(self,'scope',{get: getScope,set: setScope});

            /*********************************
            /* GETTERS AND SETTERS definitions
            /********************************/
            var _msg = [];
            function getMsg(){
                return _msg;
            }
            function setMsg(x){
                // assume over-write of current message array
                if(Array.isArray(x)){
                    _msg = x;
                }
                // assume clearing message array
                else if(x == ''){
                    _msg = [];
                }
                // else add entry to existing message array
                else{
                    _msg.push(x);
                }
            }
            var _scope = null;
            function getScope(){
                return _scope;
            }
            function setScope($scope){
                if(_scope == null){
                    $scope.$on('$destroy',function(){
                        _cleanUp();
                    });
                }
                _scope = $scope;

            }

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            SysMan.Logger.entry('START ' + self.constructor.name + '.construct()','App_Common_Abstracts_Controller');

            if(!_constructorSet){
                _errMsg = 'You just instantiated a Controller without properly setting the constructor.  You should have ' +
                    'set the constructor in the prototype, like so:  "MyCtrl.prototype.constructor = MyCtrl".  Please tend to this.';
                SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.CTRL_ERROR);
            }

            if(!_paramPresent){
                _errMsg = 'ERROR:  You did not pass the URL parameters to the Controller superclass when you called the constructor.  ' +
                    'Expectation is that you pass those parameters, so that the controller base class can trigger actions as appropriate.  ';
                if(_constructorSet){
                    _errMsg = _errMsg + 'The controller in error is "'+self.constructor.name+'".';
                }else{
                    _errMsg = _errMsg + 'Additionally, since you did not set the constructor correctly, I cannot tell you the controller name.'
                }
                SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.CTRL_ERROR);
            }

            if(!SysMan.Logger.inError && self._isActionController){
                //run the controller action after the document is ready
                angular.element(document).ready(function () {
                    self.processStateChange($stateParams,SysMan.state,true);
                });
            }

            SysMan.Logger.entry('END ' + self.constructor.name + '.construct()','App_Common_Abstracts_Controller');

            return self;
        }

        /**
         * @property    App_Common_Abstracts_Controller#SysMan      - reference to the App object
         * @type        App_Common_Models_SysMan
         * @public
         **/
         Object.defineProperty(App_Common_Abstracts_Controller.prototype,"SysMan",{get: getSysMan, set: setSysMan});
        function getSysMan(){
            return SysMan;
        }
        function setSysMan(value){
            var _msg = 'Set of Controller.SysMan not allowed!';
            SysMan.Logger.entry(_msg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION
         *****************************************/
        /**
         * Routes to specified state
         *
         * @method   goToState
         * @public
         * @param   {string}    module          - identifies module destination
         * @param   {string}    controller      - identifies controller destination
         * @param   {string}    action          - identifies action state within new destination
         * @return  {boolean}
         */
        App_Common_Abstracts_Controller.prototype.goToState = function(module,controller,action){
            var _newState = {
                "module":       module,
                "controller":   controller,
                "action":       action
            };

            var _sameController =
                _newState.module == SysMan.state.module && _newState.controller == SysMan.state.controller;
            var _sameState = _sameController && SysMan.state.action == _newState.action;

            if(!_sameState){
                $state.go('module.controller.action',_newState);
            }

        };

        /**
         * Executes logic following state change.
         *
         * @method   processStateChange
         * @public
         * @param   {object}    newState        - new state parameters
         * @param   {object}    oldState        - old state parameters
         * @param   {boolean}   isConstruct     - flags if processing controller constructor
         */
        App_Common_Abstracts_Controller.prototype.processStateChange = function(newState,oldState,isConstruct){
            //if(typeof newState !== 'undefined' && typeof oldState !== 'undefined'){
            if(this._isActionController){
                var _paramCorrect = ('module' in newState) && ('controller' in newState) && ('action' in newState);
                var _sameState =
                    SysMan.state.module == newState.module &&
                    SysMan.state.controller == newState.controller &&
                    SysMan.state.action == newState.action;
                var _newController =
                    SysMan.state.module != newState.module ||
                    (SysMan.state.module == newState.module && SysMan.state.controller != newState.controller);


                // Process state change always on construction, otherwise only when changing action of same controller.
                // Construction flag required because the state transition before the new controller is instantiated.
                // Hence the logic below cannot run the target controller's action because it does not yet exist.
                if(_paramCorrect && (isConstruct || (!_sameState && !_newController))){
                    SysMan.Logger.entry(
                        this.constructor.name + '.processStateChange(), from state '
                        + JSON.stringify(oldState) + '; to state ' + JSON.stringify(newState),
                        this.constructor.name
                    );
                    SysMan.state = {
                        "module":       newState.module,
                        "controller":   newState.controller,
                        "action":       newState.action
                    };
                    try{
                        SysMan.Logger.entry('START ' + this.constructor.name + '.' + newState.action + 'Action()','App_Common_Abstracts_Controller');
                        // run the action specified by the URL
                        this[newState.action+'Action']();
                        SysMan.Logger.entry('END ' + this.constructor.name + '.' + newState.action + 'Action()','App_Common_Abstracts_Controller');
                    }
                    catch(err){
                        var _errMsg = 'You did not specify a "' + newState.action + '" action for your controller = "' + this.constructor.name +
                            '" contained in your module = "' + newState.module + '".  Error reported:  ' + err.message;
                        SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.WARNING);
                    }

                }
            }

        };

        return App_Common_Abstracts_Controller;
    }

    App_Common_Abstracts_ControllerFactory.$inject = ['App_Common_Models_SysMan','$stateParams','$state','$rootScope'];
    angular.module('App').factory('App_Common_Abstracts_Controller',App_Common_Abstracts_ControllerFactory);
})();