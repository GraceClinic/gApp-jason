(function () {

    /**
     * todo:  short controller description
     *
     * @class
     * @param   {App_Common_Abstracts_Controller}  Controller
     * @returns {WordShuffle_Controllers_Layout}
     */
    // todo:  itemize the other dependencies injected into this controller factory
    function WordShuffle_Controllers_LayoutController(Controller) {

        // todo:  define any static variables that exist above the constructor scope (available to prototype)

        // todo: provide short description of controller and document any parameters
        /**
         * <<short description>>
         *
         * @constructor
         * @extends     {App_Common_Abstracts_Controller}
         * @this        WordShuffle_Controllers_Layout
         */
        function WordShuffle_Controllers_Layout() {
            var self = this;		// required alias to address resolution to immediate scope
            self._isActionController = false;

            /*****************
             * Public CONSTANTS
             ******************/
            // todo: use the "ng_const" live template to attach new constants on this controller

            /********************************
             * Public Properties declarations
             ********************************/
            // todo: use "ng_prop" live template to attach properties to this controller

            /**********************************************
             * Controller Actions declarations / definition
             **********************************************/
            // todo:  use "ng_action" live template to insert individual actions (these are methods accessible through URL routes)

            /**********************************************
             * Controller Methods declarations / definition
             **********************************************/
            // todo:  use "ng_method" live template to insert individual controller methods (accessible through the controller's associated view)


            /*********************************
             * GETTERS AND SETTERS definitions
             ********************************/
            // todo: move getters and setters generated from the "mp" template to this location

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            Controller.call(self);

            // todo: add constructor logic

        }

        // inherit prototype functions from superclass Controller
        WordShuffle_Controllers_Layout.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Layout.prototype.constructor = WordShuffle_Controllers_Layout;

        // return new instance of this controller
        return new WordShuffle_Controllers_Layout;
    }

    // todo:  inject other dependencies into the controller factory, and itemize in factory function above
    WordShuffle_Controllers_LayoutController.$inject = ['App_Common_Abstracts_Controller'];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Layout', WordShuffle_Controllers_LayoutController);
})();
