(function () {

    function WordShuffle_Models_InstructionsFactory(App_Common_Abstracts_Model,Page) {
        /**
         * Instructions for a specific game
         *
         * @class
         * @extends     App_Common_Abstracts_Model
         * @param       {Array}     data                          - allows setting properties during construction
         * @this        WordShuffle_Models_Instructions
         * @returns     {WordShuffle_Models_Instructions}
         */
        function WordShuffle_Models_Instructions(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            self._rootURL = '/WordShuffle/Instructions/';

            /********************************
             * PUBLIC PROPERTIES declarations
             ********************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    WordShuffle_Models_Instructions#title      - title to display over instructions
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'title',{get: getTitle,set: setTitle});
            /**
             * @property    WordShuffle_Models_Instructions#picture      - reference to picture for display next to title
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'picture',{get: getPicture,set: setPicture});
            /**
             * @property    WordShuffle_Models_Instructions#Pages      - array of page references
             * @type        WordShuffle_Models_Page[]
             * @public
             **/
            Object.defineProperty(self,'Pages',{get: getPages,set: setPages});

            /*****************************************
             * PUBLIC METHODS declaration / definition
             *****************************************/

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _title;
            function getTitle(){
                return _title;
            }
            function setTitle(value){
                _title = value;
            }
            var _picture;
            function getPicture(){
                return _picture;
            }
            function setPicture(value){
                _picture = value;
            }
            var _Pages = [];
            function getPages(){
                return _Pages;
            }
            function setPages(pages){
                // this should be an array of Page objects
                if (typeof pages === 'object'){
                    for(var key in pages){
                        if (typeof pages[key] === 'object'){
                            _Pages.push(new Page(pages[key]));
                        }
                    }
                }
            }

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor 

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START Construct',self.constructor.name);
            console.log(data);

            App_Common_Abstracts_Model.call(self,data);


            self.find();

            self.SysMan.Logger.entry('END Construct',self.constructor.name);

            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Instructions.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Instructions.prototype.constructor = WordShuffle_Models_Instructions;

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Instructions;
    }

    // todo: inject dependenciesObject
    WordShuffle_Models_InstructionsFactory.$inject = ['App_Common_Abstracts_Model','WordShuffle_Models_Page'];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Instructions', WordShuffle_Models_InstructionsFactory);
})();
