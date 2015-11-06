(function () {

    // If the parameters passed are constructors document as {function(new:<Model_Name>)}.
    // If the parameters passes are singletons document as {<Model_Name>}
    /**
     * Model factory returning the constructor for the Model Message
     *
     * @param   {App_Common_Models_Tools_Logger}    Logger  - reference to Logger singleton
     * @returns {App_Common_Models_Message}
     */
    function App_Common_Models_MessageFactory(Logger) {
        /**
         * todo: provide short description of model
         *
         * @class       App_Common_Models_Message
         * @param       {Object}     [data]            - optional data object for setting properties during instantiation
         * @this        App_Common_Models_Message
         * @returns     {App_Common_Models_Message}
         */
        function App_Common_Models_Message(data) {
            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /****************************************
             * MODEL PROPERTIES / GETTERS and SETTERS
             ****************************************/
            /**
             * The message type as one of the class constants:  INFO, SUCCESS, WARNING, and DANGER
             * @type    {string}
             * @public
             **/
            Object.defineProperty(self,'type',{get: getType, set: setType, enumerable:true});
            var _type;
            function getType(){
                return _type;
            }
            function setType(value){
                value = String(value).toLowerCase();
                var _allowed = false;
                for(var key in self.TYPES){
                    if(self.TYPES[key] == value){
                        _allowed = true;
                    }
                }
                if(_allowed){
                    _type = value;
                }else{
                    Logger.entry(
                        self.constructor.name+'.setType() called with disallowed value = '+value,
                        self.constructor.name,
                        Logger.TYPE.ERROR);
                }
            }
            /**
             * The message text to display
             * @type    {string}
             * @public
             **/
            Object.defineProperty(self,'text',{get: getText, set: setText, enumerable:true});
            var _text;
            function getText(){
                return _text;
            }
            function setText(value){
                _text = value;
            }
            
            /*******************
             * CONSTRUCTOR LOGIC
             *******************/

            if(data){
                for(var $key in data) {
                    // set property if it exists anywhere in prototype chain, hasOwnProperty only checks the object itself
                    if ($key in this) {
                        // use self reference in order to execute setter method, call using bracket notation within object scope
                        if (data[$key] !== null) {
                            this[$key] = data[$key];
                        }
                    }
                }
            }

            // most models return itself for daisy chaining
            return self;
        }

        App_Common_Models_Message.prototype.constructor = App_Common_Models_Message;

        /*********************
         * PROTOTYPE CONSTANTS
         *********************/
        /**
         * @constant    TYPES
         * Message type constants for information, success, warning, and danger messages
         *
         * @type    {{INFO:string,SUCCESS:string,WARNING:string,DANGER:string}}
         * @public
         **/
        Object.defineProperty(App_Common_Models_Message.prototype,"TYPES",{
            value: {
                INFO:'info',
                SUCCESS:'success',
                WARNING:'warning',
                DANGER:'danger'
            },
            writable: false,
            enumerable: false
        });

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return App_Common_Models_Message;
    }

    App_Common_Models_MessageFactory.$inject = [
        'App_Common_Models_Tools_Logger'
    ];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_Common').factory('App_Common_Models_Message', App_Common_Models_MessageFactory);
})();
