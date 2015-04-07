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
     * @param $stateParams
     * @param $state
     */
    function App_Common_Abstracts_ControllerFactory(SysMan,$stateParams,$state){
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

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            var _entry = self.constructor.name + '.construct START';
            SysMan.Logger.entry(_entry,'App_Common_Abstracts_Controller');

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
            else{
                var _paramCorrect = ('module' in $stateParams) && ('controller' in $stateParams) && ('action' in $stateParams);
                if(!_paramCorrect){
                    _errMsg = 'You did not pass "module", "controller", and "action" parameters within the URL for your ' +
                        'controller = "'+self.constructor.name+'"';
                    SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.WARNING);
                }else{
                    // set the application state for memory and reference
                    SysMan.state = {
                        "module":       $stateParams.module,
                        "controller":   $stateParams.controller,
                        "action":       $stateParams.action
                    }
                }
            }

            if(!SysMan.Logger.inError){
                // run the controller action after the document is ready
                angular.element(document).ready(function () {
                    try{
                        // run the action specified by the URL
                        self[$stateParams.action+'Action']();
                    }
                    catch(err){
                        _errMsg = 'You did not specify a "' + $stateParams.action + '" action for your controller = "' + self.constructor.name +
                            '" contained in your module = "' + $stateParams.module + '".  Error reported:  ' + err.message;
                        SysMan.Logger.entry(_errMsg,'App_Common_Abstracts_Controller',SysMan.Logger.TYPE.WARNING);
                    }
                });
            }

            SysMan.Logger.entry('Construct END',self.constructor.name);

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

            $state.go('module.controller.action',_newState);
        };

        return App_Common_Abstracts_Controller;
    }

    App_Common_Abstracts_ControllerFactory.$inject = ['App_Common_Models_SysMan','$stateParams', '$state'];
    angular.module('App').factory('App_Common_Abstracts_Controller',App_Common_Abstracts_ControllerFactory);
})();