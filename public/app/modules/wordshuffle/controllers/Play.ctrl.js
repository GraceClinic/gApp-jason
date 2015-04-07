(function () {

    /**
     * Controller factory returning an instance of the WordShuffle_Controller_Play controller.
     *
     * @class
     * @param   {App_Common_Abstracts_Controller}  Controller
     * @returns {WordShuffle_Controllers_Play}
     */
    function WordShuffle_Controllers_PlayController(Controller,Game,Player) {

        /**
         * Defines state control from the Play side of the site.
         *
         * @constructor
         * @extends     {App_Common_Abstracts_Controller}
         * @this        WordShuffle_Controllers_Play
         */
        function WordShuffle_Controllers_Play() {
            var self = this;		// required alias to address resolution to immediate scope

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
            /**
             * Logic following index action against the Play controller
             *
             * @method   indexAction
             * @public
             */
            self.indexAction = function(){
                // todo: define any parameters and then code action logic
                console.log('Play.index() action');
            };

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
        WordShuffle_Controllers_Play.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Play.prototype.constructor = WordShuffle_Controllers_Play;

        // return new instance of this controller
        return new WordShuffle_Controllers_Play;
    }

    // todo:  inject other dependencies into the controller factory, and itemize in factory function above
    WordShuffle_Controllers_PlayController.$inject = ['App_Common_Abstracts_Controller','WordShuffle_Models_Game','WordShuffle_Models_Player'];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Play', WordShuffle_Controllers_PlayController);
})();
