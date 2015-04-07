(function () {

    function WordShuffle_Models_PageFactory(App_Common_Abstracts_Model, $sce) {
        /**
         * todo: provide short description of model
         *
         * @constructor
         * @extends     App_Common_Abstracts_Model
         * @param       {Array}     data                          - allows setting properties during construction
         * @this        WordShuffle_Models_Page
         * @returns     {WordShuffle_Models_Page}
         */
        function WordShuffle_Models_Page(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /********************************
             * PUBLIC PROPERTIES declarations
             ********************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    WordShuffle_Models_Page#idInstructions      - foreign key to Instructions object
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'idInstructions',{get: getIdInstructions,set: setIdInstructions});
            /**
             * @property    WordShuffle_Models_Page#body      - reference to html file containing body content
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'body',{get: getBody,set: setBody});
            /**
             * @property    WordShuffle_Models_Page#sequence      - order of page
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'sequence',{get: getSequence,set: setSequence});


            /*****************************************
             * PUBLIC METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _idInstructions = 0;
            function getIdInstructions(){
                return _idInstructions;
            }
            function setIdInstructions(value){
                _idInstructions = value;
            }
            var _body = '';
            function getBody(){
                return _body;
            }
            function setBody(value){
                _body = $sce.trustAsHtml(value);
            }
            var _sequence = 0;
            function getSequence(){
                return _sequence;
            }
            function setSequence(value){
                _sequence = value;
            }

            /******************
             * PRIVATE FUNCTIONS
             *******************/
            // todo:  create any private functions that reside within the constructor 

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START construct()',self.constructor.name);
            App_Common_Abstracts_Model.call(self,data);

            self.SysMan.Logger.entry('END construct(), data = ',self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        /*****************************************
         * PROTOTYPE CONSTANTS
         *****************************************/
        // todo: use the "ng_const" live template to insert new constants on the prototype, use ALL_CAPS_WITH_UNDERSCORE for name

        /*****************************************
         * PROTOTYPE PUBLIC PROPERTIES DECLARATION
         *****************************************/
        // todo: use the "ng_pprop" live template to insert prototype properties

        /*************************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION/DEFINITION
         *************************************************/
        // todo: use the "ng_pmethod" live template to insert prototype methods

        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

            // setup the inheritance chain
        WordShuffle_Models_Page.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Page.prototype.constructor = WordShuffle_Models_Page;

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Page;
    }

    // todo: inject dependenciesObject
    WordShuffle_Models_PageFactory.$inject = ['App_Common_Abstracts_Model','$sce'];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Page', WordShuffle_Models_PageFactory);
})();
