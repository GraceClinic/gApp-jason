
(function(){

    /**
     * Welcome controller factory spawning a controller object
     *
     * @constructor
     * @param   {function(new:App_Common_Abstracts_Controller)}     Controller
     * @param   {function(new:WordShuffle_Models_Instructions)}     Instructions
     * @returns {WordShuffle_Controllers_Welcome}
     */
    function WelcomeController(Controller,Instructions){

        var _count = 0;
        /**
         * Presents game instructions to the user
         *
         * @constructor
         * @extends         {App_Common_Abstracts_Controller}
         * @this            WordShuffle_Controllers_Welcome
         */
        function WordShuffle_Controllers_Welcome(){

            var self = this;

            // define all of the action methods, these actions are accessible through URL routes
            self.indexAction = function(){
//                $("#Welcome-instructions-page").load(self.Instructions.Pages[0].body);
            };

            /**
             * @property    WordShuffle_Controllers_Welcome#Instructions      - instructions for playing WordShuffle
             * @type        WordShuffle_Models_Instructions
             * @public
             **/
            Object.defineProperty(self,'Instructions',{get: getInstructions,set: setInstructions});

            // define other controller actions, these actions are accessible through the controller HTML view file

            /*********************************
             * GETTERS AND SETTERS definitions
             ********************************/
            var _Instructions = new Instructions();
            function getInstructions(){
                return _Instructions;
            }
            function setInstructions(){
                self.SysMan.Logger.entry(
                    'Welcome.Instructions.set not ALLOWED!',
                    self.constructor.name,
                    self.SysMan.Logger.TYPE.ERROR,
                    self.SysMan.Logger.ERRNO.CTRL_ERROR);
            }

            /***************************
             * PUBLIC METHOD DEFINITIONS
             ***************************/

            Controller.call(self);

            self.SysMan.Logger.entry('Constructor START',self.constructor.name);
            self.msg = 'Welcome to WordShuffle!';
            self.msg = "Please read the instructions and learn more about this exciting game!";

            self.SysMan.Logger.entry('Constructor END',self.constructor.name);
        }
        // inherit prototype functions from superclass Controller
        WordShuffle_Controllers_Welcome.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Welcome.prototype.constructor = WordShuffle_Controllers_Welcome;

        return new WordShuffle_Controllers_Welcome();
    }

    // inject dependenciesObject
    WelcomeController.$inject = [
        'App_Common_Abstracts_Controller',
        'WordShuffle_Models_Instructions'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Welcome',WelcomeController);
})();
