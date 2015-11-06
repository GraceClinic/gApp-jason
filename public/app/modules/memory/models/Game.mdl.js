(function () {

    /**
     * Model factory returning a single instance of Memory_Models_Game
     *
     * @function Game_Factory
     * @param   {App_Common_Abstracts_Model}      Model      - superclass
     * @param   {function(new:Memory_Models_Game_Clock)}    Clock      - game clock constructor
     * @param   {App_Common_Models_Message}       Message     - constructor for Message object
     * @returns {Memory_Models_Game}
     */
    function Game_Factory(Model,Clock,Message) {

        /**
         * Memory game
         *
         * @class       Memory_Models_Game
         * @extends     {App_Common_Abstracts_Model}
         * @param       {array}     [data]        - associative array of model properties
         * @returns     {Memory_Models_Game}
         */
        function Memory_Models_Game(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /************************
             * Public Properties declarations
             ************************/
            /**
             * @property    Memory_Models_Game#Clock      - game clock
             * @type        Memory_Models_Game_Clock
             * @public
             **/
            Object.defineProperty(self,'Clock',{get: getClock,set: setClock});
            /*
             Set callback function within Clock, attach anonymous function that executes Game.save().  This is
             necessary because when the anonymous function is called, the Game object will be bound to it.  If
             I make self.save directly the argument, it will resolve to Clock scope.
             */
            var _Clock = new Clock({'callOnExpire':function(){
                self.msg = {text:'Game is Over!',type:Message.prototype.TYPES.INFO}
                }
            });
            function getClock(){
                return _Clock;
            }
            function setClock(value){
                _Clock = value;
            }

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/



            // watch for key presses
            jQuery(document).on('keypress',function(e){
                if(e.which == 13){
                    // what?
                }
            });

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            self.SysMan.Logger.entry('START ' + self.constructor.name+'.construct()',self.constructor.name);
            Model.call(self,data);

            self._rootURL = '/Memory/Game/';

            self.excludeFromPost([
            ]);

            self.SysMan.Logger.entry('END ' + self.constructor.name+'.construct()',self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        Memory_Models_Game.prototype = Object.create(Model.prototype);
        Memory_Models_Game.prototype.constructor = Memory_Models_Game;

        /*****************************************
         * PROTOTYPE PUBLIC PROPERTIES DECLARATION
         *****************************************/

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION
         *****************************************/

        /**
         * Process Game state after return of safe operation
         *
         * @method   _postSave
         * @public
         */
        Memory_Models_Game.prototype._postSave = function(){

        };

        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/
        // move getter and setter definitions here resulting from execution of the "mpp" live template

        /*****************************************
         * PROTOTYPE PUBLIC METHODS DEFINITION
         *****************************************/
        // move the method definition here resulting from execution of the "mpm" live template

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return new Memory_Models_Game;
    }

    // inject dependenciesObject
    Game_Factory.$inject = [
        'App_Common_Abstracts_Model',
        'Memory_Models_Game_Clock',
        'App_Common_Models_Message'
    ];

    // register model with Angularjs application for dependency injection as required
    angular.module('App_Memory').factory('Memory_Models_Game', Game_Factory);
})();
