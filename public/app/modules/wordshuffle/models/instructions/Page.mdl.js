(function () {

    function WordShuffle_Models_Instructions_PageFactory(App_Common_Abstracts_Model, $sce) {
        /**
         * todo: provide short description of model
         *
         * @constructor
         * @extends     App_Common_Abstracts_Model
         * @param       {Array}     data                          - allows setting properties during construction
         * @this        WordShuffle_Models_Instructions_Page
         * @returns     {WordShuffle_Models_Instructions_Page}
         */
        function WordShuffle_Models_Instructions_Page(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /********************************
             * PUBLIC PROPERTIES declarations
             ********************************/
            /**
             * @property    WordShuffle_Models_Instructions_Page#idInstructions      - foreign key to Instructions object
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'idInstructions',{get: getIdInstructions,set: setIdInstructions});
            /**
             * @property    body
             * HTML content to display
             *
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'body',{get: getBody,set: setBody});
            /**
             * @property    WordShuffle_Models_Instructions_Page#sequence      - order of page
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'sequence',{get: getSequence,set: setSequence});

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

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.SysMan.Logger.entry('START ' + self.constructor.name+'.construct()',self.constructor.name);
            App_Common_Abstracts_Model.call(self,data);

            self.SysMan.Logger.entry('END ' + self.constructor.name+'.construct()',self.constructor.name);
            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Instructions_Page.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Instructions_Page.prototype.constructor = WordShuffle_Models_Instructions_Page;

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Instructions_Page;
    }

    WordShuffle_Models_Instructions_PageFactory.$inject = ['App_Common_Abstracts_Model','$sce'];

    angular.module('App_WordShuffle').factory('WordShuffle_Models_Instructions_Page', WordShuffle_Models_Instructions_PageFactory);
})();
