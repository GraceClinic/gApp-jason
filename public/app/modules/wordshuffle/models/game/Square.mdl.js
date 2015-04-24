(function () {

    /**
     * Model factory returning a <singleton or constructor> of the Model Square
     *
     * @param {App_Common_Abstracts_Model}   App_Common_Abstracts_Model
     * @returns {function(new:WordShuffle_Models_Game_Square)}
     * @constructor
     */
    function WordShuffle_Models_Game_SquareFactory(App_Common_Abstracts_Model) {
        /**
         * One playing square on the WordShuffle board
         *
         * @constructor
         * @extends     App_Common_Abstracts_Model
         * @param       {(array|Object)}    data                        - data array for setting properties during instantiation
         * @this        WordShuffle_Models_Game_Square
         * @returns     {WordShuffle_Models_Game_Square}
         */
        function WordShuffle_Models_Game_Square(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /********************************
             * MODEL PROPERTIES declarations
             ********************************/
            // todo: use "ng_prop" live template to inject more model properties
            /**
             * @property    WordShuffle_Models_Game_Square#letter      - letter contained in square
             * @type        string
             * @public
             **/
            Object.defineProperty(self,'letter',{get: getLetter,set: setLetter});
            /**
             * @property    WordShuffle_Models_Game_Square#row      - row index
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'row',{get: getRow,set: setRow});
            /**
             * @property    WordShuffle_Models_Game_Square#col      - column index
             * @type        int
             * @public
             **/
            Object.defineProperty(self,'col',{get: getCol,set: setCol});
            /**
             * @property    WordShuffle_Models_Game_Square#isSelected      - flags if square is selected
             * @type        boolean
             * @public
             **/
            Object.defineProperty(self,'isSelected',{get: getIsSelected,set: setIsSelected});
            /**
             * @property    WordShuffle_Models_Game_Square#callOnClick      - call back function link to the selection of the square
             * @type        function()
             * @public
             **/
            Object.defineProperty(self,'callOnClick',{get: getCallOnClick,set: setCallOnClick});

            /*****************************************
             * MODEL METHODS declaration / definition
             *****************************************/
            // todo:  use "ng_method" live template to insert individual model methods 

            /**********************************
             /* GETTERS AND SETTERS definitions
             /*********************************/
            var _letter;
            function getLetter(){
                return _letter;
            }
            function setLetter(value){
                _letter = value;
            }
            var _row;
            function getRow(){
                return _row;
            }
            function setRow(value){
                _row = value;
            }
            var _col;
            function getCol(){
                return _col;
            }
            function setCol(value){
                _col = value;
            }
            var _isSelected;
            function getIsSelected(){
                return _isSelected;
            }
            function setIsSelected(value){
                _isSelected = value;
                if(self.DOM !== null){
                    if(_isSelected){
                        self.DOM.css('opacity',0.7);
                        self.DOM.css('border-color','yellow');
                    }else{
                        self.DOM.css('opacity',1.0);
                        self.DOM.css('border-color','#181b42');
                    }
                }

            }
            var _callOnClick;
            function getCallOnClick(){
                return _callOnClick;
            }
            function setCallOnClick(value){
                // TODO: validate value is a function
                _callOnClick = value;
            }


                // extend from the super class
            App_Common_Abstracts_Model.call(self, data);

            /*******************
             * CONSTRUCTOR LOGIC
             *******************/
            self.excludeFromPost(['callOnClick']);

            // most models return itself for daisy chaining
            return self;
        }

        // setup the inheritance chain
        WordShuffle_Models_Game_Square.prototype = Object.create(App_Common_Abstracts_Model.prototype);
        WordShuffle_Models_Game_Square.prototype.constructor = WordShuffle_Models_Game_Square;

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
        // todo:  use "ng_relay" to insert methods you wish to relay to the backend and service thereafter
         /* todo: Largely the basic save(), find(), delete(), and relay() methods do not change.  When they do and you only wish
          * to extend the logic, use "App_Common_Abstracts_Model.prototype.<<methodName>>.call(this)" to execute parent method.*/

        /**
         * Logic executed after find event returns
         *
         * @method   _postFind
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Square.prototype._postFind = function( ){
            // todo: determine if running logic after execution of the find() method
            return true;
        };

        /**
         * Processing executed after results return from a save operation.
         *
         * @method   _postSave
         * @protected
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Square.prototype._postSave = function() {
            // todo: determine if _postSave() logic required, otherwise delete
            return true;
        };


        /**
         * Model logic preceding any request to the backend: find(), save(), delete(), and relay()
         *
         * @method   _preDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Square.prototype._preDispatch = function () {
            // todo: determine if pre-dispatch logic required, otherwise delete
            return true;
        };

        /**
         * Model logic following return of any request from the backend: find(), save(), delete(), and relay()
         *
         * @method   _postDispatch
         * @public
         * @return   {boolean}
         */
        WordShuffle_Models_Game_Square.prototype._postDispatch = function () {
            return true;
        };

        /******************************************
         * PROTOTYPE GETTERS and SETTERS definition
         ******************************************/

        /*******************************************
         * PRIVATE FUNCTIONS shared at Factory level
         *******************************************/
        // todo: create private functions shared amongst all class instances

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return WordShuffle_Models_Game_Square;
    }

    // todo: inject dependenciesObject
    WordShuffle_Models_Game_SquareFactory.$inject = ['App_Common_Abstracts_Model'];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_WordShuffle').factory('WordShuffle_Models_Game_Square', WordShuffle_Models_Game_SquareFactory);
})();
