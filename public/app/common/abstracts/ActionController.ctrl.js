/**
 * File: Controller2
 * User: jderouen
 * Date: 5/19/2015
 * Time: 2:52 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * File: Controller
 * User: jderouen
 * Date: 1/12/15
 * Time: 12:47 PM
 */
(function(){

    /**
     * Action Controller superclass, serves as the base for all angularjs controllers intended to control URL actions.
     * Monitors URL state and triggers action methods based on URL parameters passed to controller
     *
     * @class       App_Common_Abstracts_ActionController
     */
    function App_Common_Abstracts_ActionController(SysMan,$stateParams,$state,$rootScope,$scope,self){

        // private variables serving prototype
        var _paramPresent = ($stateParams !== null) && ($stateParams instanceof Object);

        // register listener to rootScope for reacting to state changes and store to clean up function for trash collection
        var _cleanUp = $rootScope.$on('$stateChangeSuccess', function(event,toState,toParams,fromState,fromParams){
            _processStateChange(toParams,fromParams,false);
        });

        // private class variables
        var _constructorSet = self.constructor.name !== 'Scope' && self.constructor.name !== 'Object'
            && self.constructor.name !== 'App_Common_Abstracts_ActionController';
        var _errMsg = '';

        $scope.$on('$destroy',function(){
            _cleanUp();
        });

        /**
         * If set to string value, SysMan will default type as INFO
         *
         * @property    App_Common_Abstracts_ActionController#msg     - messages proxied from SysMan collected from models
         * @type {{text: string, type: string}|string}
         * @public
         */
        Object.defineProperty(self,'msg',{get: getMsg,set: setMsg, enumerable: true});
        function getMsg(){
            return SysMan.msg;
        }
        function setMsg(x){
            SysMan.msg = x;
        }

        /**
         * If set to string value, SysMan will default type as INFO
         *
         * @property    App_Common_Abstracts_ActionController#SysMan     - provide reference to SysMan
         * @type {App_Common_Models_SysMan}
         * @public
         */
        Object.defineProperty(self,'SysMan',{get: getSysMan,set: setSysMan, enumerable: true});
        function getSysMan(){
            return SysMan;
        }
        function setSysMan(){
            SysMan.Logger.entry('Attempted set of SysMan not allowed.',self.constructor.name,SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.MODEL_ERROR);
        }

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
        self.goToState = function(module,controller,action){
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
         * @private
         * @param   {object}    newState        - new state parameters
         * @param   {object}    oldState        - old state parameters
         * @param   {boolean}   isConstruct     - flags if processing controller constructor
         */
        function _processStateChange(newState,oldState,isConstruct){
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
                    self.constructor.name + '.processStateChange(), from state '
                    + JSON.stringify(oldState) + '; to state ' + JSON.stringify(newState),
                    'App_Common_Abstracts_ActionController'
                );
                SysMan.state = {
                    "module":       newState.module,
                    "controller":   newState.controller,
                    "action":       newState.action
                };
                try{
                    SysMan.Logger.entry('START ' + self.constructor.name + '.' + newState.action + 'Action()','App_Common_Abstracts_ActionController');
                    // run the action specified by the URL
                    self[newState.action+'Action']();
                    SysMan.Logger.entry('END ' + self.constructor.name + '.' + newState.action + 'Action()','App_Common_Abstracts_ActionController');
                }
                catch(err){
                    var _errMsg = 'You did not specify a "' + newState.action + '" action for your controller = "' + self.constructor.name +
                        '" contained in your module = "' + newState.module + '".  Error reported:  ' + err.message;
                    SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_ActionController',SysMan.Logger.TYPE.WARNING);
                }

            }

        }

        /************************
         * CONSTRUCTOR LOGIC
         ************************/

        // clear any SysMan messages remaining from previous controllers
        var i = SysMan.msg.length;
        while(i > 0){
            SysMan.msg.shift();
            i--;
        }
        SysMan.Logger.entry(self.constructor.name + '.construct(); cleared SysMan.msg from previous controller.','App_Common_Abstracts_ActionController');

        if(!_constructorSet){
            _errMsg = 'You just instantiated a Controller without properly setting the constructor.  You should have ' +
            'set the constructor in the prototype, like so:  "MyCtrl.prototype.constructor = MyCtrl".  Please tend to this.';
            SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_ActionController',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        if(!_paramPresent){
            _errMsg = 'ERROR:  You did not pass the URL parameters to the Controller superclass when you called the constructor.  ' +
            'Expectation is that you pass those parameters, so that the controller base class can trigger actions as appropriate.  ';
            if(_constructorSet){
                _errMsg = _errMsg + 'The controller in error is "'+self.constructor.name+'".';
            }else{
                _errMsg = _errMsg + 'Additionally, since you did not set the constructor correctly, I cannot tell you the controller name.'
            }
            SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_ActionController',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        if(!SysMan.Logger.inError){
            //run the controller action after the document is ready
            angular.element(document).ready(function () {
                _processStateChange($stateParams,SysMan.state,true);
            });
        }

    }

    App_Common_Abstracts_ActionController.$inject = ['App_Common_Models_SysMan','$stateParams','$state','$rootScope','$scope','self'];

    angular.module('App').controller('App_Common_Abstracts_ActionController',App_Common_Abstracts_ActionController);
})();