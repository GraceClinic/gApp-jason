(function () {

    function Main_Controllers_ErrorController(Controller) {

        /**
         * Default application wide error controller.  Displays content of Logger stack.
         *
         * @class       Main_Controllers_Error
         * @extends     {App_Common_Abstracts_Controller}
         **/
        function Main_Controllers_Error() {
            var self = this;		// required alias to address resolution to immediate scope

            /********************************
             * Public Properties declarations
             ********************************/
            // todo: use "mp" live template to inject more model properties


            /**********************************************
             * Controller Actions declarations / definition
             **********************************************/
            /**
             * Default error action, displays Logger stack information
             *
             * @method   errorAction
             * @public
             */
            self.errorAction = function(){
                //todo:  add logic for this action
            };

            // call superclass and data array
            Controller.call(self);

            // set the state variables explicitly since this is a fallback Error controller
            self.SysMan.state = {
                "module": 'main',
                "controller": 'error',
                "action": 'error'
            }

        }

        // inherit prototype functions from superclass Controller
        Main_Controllers_Error.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        Main_Controllers_Error.prototype.constructor = Main_Controllers_Error;

        // return new instance of this controller
        return new Main_Controllers_Error;
    }

    // todo:  inject other dependencies into the controller factory, and itemize in factory function above
    Main_Controllers_ErrorController.$inject = ['App_Common_Abstracts_Controller'];

    angular.module('App_Main').controller('Main_Controllers_Error', Main_Controllers_ErrorController);
})();
