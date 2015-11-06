(function () {

    /**
     * Model factory for providing the superclass for all application models
     *
     * @param {App_Common_Models_SysMan}    SysMan  - reference to SysMan singleton
     * @param {function}  $http
     * @param {function(new:App_Common_Models_Message(data))}   Message - message constructor
     * @returns {App_Common_Abstracts_Model}
     */
    function App_Common_Abstracts_ModelFactory(SysMan,$http,Message) {
        var _uidCount = 0;

        /**
         * Model superclass defines base properties and methods for all Model instances
         *
         * @class       App_Common_Abstracts_Model
         * @extends     {Function}
         * @param       {array} data        - Array of class properties for setting during instantiation
         * @returns     {App_Common_Abstracts_Model}
         */
        function App_Common_Abstracts_Model(data) {

            // proxy the "this" keyword to avoid scope resolution issues
            var self = this;

            /**
             * Defines the API URL that serves as data source
             * @type {string}
             * @protected
             */
            self._rootURL = '/WordShuffle/Main/';

            /******************************************
             * PUBLIC PROPERTIES / GETTERS and SETTERS
             ******************************************/
            /**
             * Unique identifier amongst all models
             * @type    {int}
             * @public
             */
            Object.defineProperty(self,"uid",{get: getUid, enumerable: true});
            var _uid = _nextUid();
            function getUid(){
                return _uid;
            }
            /**
             * Primary key for the table containing model data
             * @type    {int}
             * @public
             */
            Object.defineProperty(self,"id",{get: getId,set: setId, enumerable: true});
            var _id = 0;
            function getId(){
                return _id;
            }
            function setId(value){
                _id = value;
            }
            /**
             * The HTML "id" tag that uniquely identifies the DOM element
             * @type    {string}
             * @public
             */
            Object.defineProperty(self,"idTag",{get: getIdTag,set: setIdTag, enumerable: true});
            var _idTag = '';
            function getIdTag(){
                return _idTag;
            }
            function setIdTag(value){
                _idTag = value;
            }
            /**
             * The HTML DOM element
             * @type    {object}
             * @public
             */
            Object.defineProperty(self,"DOM",{get: getDOM,set: setDOM, enumerable: true});
            var _DOM = null;
            function getDOM(){
                // DOM object identified by id Tag
                _DOM = $('#'+self.idTag);
                if(_DOM.length == 0){
                    _DOM = null;
                }

                return _DOM;
            }
            function setDOM(value){
                _DOM = value;
            }

            // TODO: Move properties on prototype here and make configurable:false

            /************************
             * CONSTRUCTOR LOGIC
             ************************/
            self.excludeFromPost(['uid','idTag','DOM','properties','x','y','height','width','SysMan']);

            if(data){
                self.setFromArray(data);
            }

            // most models return itself for daisy chaining
            return self;
        }

        /***************************************************
         * PROTOTYPE PUBLIC PROPERTIES / SETTERS and GETTERS
         ***************************************************/
        /**
         * x location of the object (typically applies to canvas object)
         * @type        int
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"x",{get: getX, set: setX, enumerable: true});
        var _x = [];
        function getX(){
            return _x[this.uid];
        }
        function setX(value){
            _x[this.uid] = value;
        }
        /**
         * y location of the object (typically applies to canvas object)
         * @type        int
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"y",{get: getY, set: setY, enumerable: true});
        function getY(){
            return _y[this.uid];
        }
        var _y = [];
        function setY(value){
            _y[this.uid] = value;
        }
        /**
         * height of object
         * @type        int
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"height",{get: getHeight, set: setHeight, enumerable: true});
        var _height = [];
        function getHeight(){
            return _height[this.uid];
        }
        function setHeight(value){
            _height[this.uid] = value;
        }
        /**
         * width of the object
         * @type        int
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"width",{get: getWidth, set: setWidth, enumerable: true});
        var _width = [];
        function getWidth(){
            return _width[this.uid];
        }
        function setWidth(value){
            _width[this.uid] = value;
        }
        /**
         * reference to the SysMan singleton
         * @type        App_Common_Models_SysMan
         * @public
         **/
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"SysMan",{get: getSysMan, set: setSysMan, enumerable: true});
        function getSysMan(){
            return SysMan;
        }
        function setSysMan(){
            var _msg = 'Set of Model.SysMan not allowed!';
            SysMan.Logger.entry(_msg,self.constructor.name,SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.MODEL_ERROR);
            //SysMan.setFromArray(data);
        }
        /**
         * all properties attached to the model
         * @type        string[]
         * @public
         **/
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"properties",{get: getProperties, set: setProperties, enumerable: true});
        var _properties = [];
        function getProperties(){
            // todo:  Model.properties getter does not grab prototype properties from the superclass (itself)
//            return Object.getOwnPropertyNames(Object.getPrototypeOf(this));
            if(!(this.uid in _properties)){
                var i;
                var isFunction;
                var isProtected;

                // todo: it's likely that specifying Object.defineProperty as enumerable will show prototype properties, must validate this
                _properties[this.uid] = Object.getOwnPropertyNames(this);

                // build JSON object of only model properties
                var _prototype = Object.getPrototypeOf(this);   //eval(this.constructor.name + '.prototype');
                _properties[this.uid] = _properties[this.uid].concat(Object.getOwnPropertyNames(_prototype));

                for (i=0;i<_properties[this.uid].length;i++){
                    isFunction = typeof this[_properties[this.uid][i]] == 'function';
                    isProtected = _properties[this.uid][i].charAt(0) == '_';
                    if(isFunction || isProtected){
                        // remove all functions from properties array
                        _properties[this.uid].splice(i,1);
                        // set i back one to account for element removal
                        i=i-1;
                    }
                }
            }
            return _properties[this.uid];
        }
        function setProperties(){
            this.SysMan.Logger.entry(
                'Set of "properties" not allowed!',
                this.constructor.name,
                this.SysMan.Logger.TYPE.ERROR,
                this.SysMan.Logger.ERRNO.MODEL_ERROR);
        }
        /**
         * stores messages as an array of Message objects with keys ("type","text")
         * @type        {{text:string,type:string}|App_Common_Models_Message|App_Common_Models_Message[]}
         * @public
         **/
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"msg",{get: getMsg, set: setMsg, enumerable: true});
        var _msg = [];
        function getMsg(){
            return _msg[this.uid];
        }
        function setMsg(x){
            if(typeof x === 'App_Common_Models_Message'){
                if(this.uid in _msg){
                    _msg[this.uid].push(x);
                }else{
                    _msg[this.uid] = [];
                    _msg[this.uid].push(x);
                }
            }
            else if(Array.isArray(x) && x.length > 0){
                // must be an array of Message objects
                if(typeof x === 'App_Common_Models_Message'){
                    _msg[this.uid] = x;
                }else{
                    SysMan.Logger.entry(
                        self.constructor.name + 'setMsg() value incorrect',
                        'App_Common_Abstracts_Model',
                        SysMan.Logger.TYPE.ERROR
                    )
                }
            }
            // assume clearing message array, null is also considered object and/or array
            else if(Array.isArray(x) && x.length == 0){
                _msg[this.uid] = [];
            }
            // else object passed representing Message object
            else if(typeof x === 'object'){
                x = new Message(x);
                if(this.uid in _msg){
                    _msg[this.uid].push(x);
                }else{
                    _msg[this.uid] = [];
                    _msg[this.uid].push(x);
                }
            }
            else{
                // nothing
            }
        }
        /**
         * tracks models status from http request to receipt
         * @type        string
         * @public
         **/
        Object.defineProperty(App_Common_Abstracts_Model.prototype,'status',{get: getStatus,set: setStatus, enumerable: true});
        var _status = [];
        function getStatus(){
            return _status[this.uid];
        }
        function setStatus(value){
            _status[this.uid] = value;
        }


        /*****************
         * MODEL CONSTANTS
         *****************/
        /**
         * Used to flag sub-state of a model as Pre-dispatch
         * @constant
         * @type    {string}
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"PRE_DISPATCH",{value: "PRE_DISPATCH", writable: false, enumerable: false});
        /**
         * Used to flag sub-state of a model as post-dispatch
         * @constant
         * @type    {string}
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"POST_DISPATCH",{value: "POST_DISPATCH", writable: false, enumerable: false});
        /**
         * Used to flag sub-state of a model as ready
         * @constant
         * @type    {string}
         * @public
         */
        Object.defineProperty(App_Common_Abstracts_Model.prototype,"READY",{value: "READY", writable: false, enumerable: false});

        /**
         * Converts model to JSON object containing only the model properties
         *
         * @method   toJSON
         * @public
         * @param    {boolean}   scrubExcludes  - flag to return only post properties
         * @return   {object}
         */
        App_Common_Abstracts_Model.prototype.toJSON = function(scrubExcludes){
            if (typeof(scrubExcludes)==='undefined') scrubExcludes = false;
            var _tmp = {};

            // set properties per argument passed during construction
            for(var i=0; i<this.properties.length; i++){
                var _key = this.properties[i];
                var _isIncluded = _excludeFromPost[this.uid].indexOf(_key) < 0;
                if(_isIncluded){
                    if(this[_key] instanceof App_Common_Abstracts_Model){
                        _tmp[_key] = this[_key].toJSON(scrubExcludes);
                    }else if(Object.prototype.toString.call(this[_key]) === '[object Array]'){
                        _tmp[_key] = _processArray(this[_key],scrubExcludes);
                    }else{
                        _tmp[_key] = this[_key];
                    }
                }
            }

            return _tmp;
        };

        /*************************************************
         * PROTOTYPE PUBLIC METHODS DECLARATION/DEFINITION
         *************************************************/
        /**
         * TODO:  It is possible that multiple actions go out before return of information from backend.  The status
         * property tracks a singular event without awareness of other pending actions.  The status update needs to be
         * aware of these other events so that the flag is not changed to READY when the object is not actually READY.
         */

        /**
         * Impromptu class allowing for documentation of the response.data return value
         *
         * @class
         * @name        ResponseDataType
         * @property    {object}   props
         * @property    {object}   results
         *
         */
        /**
         * Retrieves model attributes from data source based on “id” property.  This may result in getting information
         * from multiple tables as dictated by the mapper side of the ORM model.  On the frontend side if “id” property
         * present, find establishes the id as a URL parameter and execute a “get” request.  Otherwise, find executes
         * an “index” request to the backend.  Backend proceeds to execute find operation.  Upon successful response
         * from backend, model executes "_postFind()" logic.
         *
         * @method   find
         * @public
         * @return  {promise}
         */
        App_Common_Abstracts_Model.prototype.find = function(){
            // proxy this so it does not get lost in the promise
            var self = this;
            var _url = self._rootURL;
            var _promise = null;

            SysMan.Logger.entry('START '+self.constructor.name+'.find()','App_Common_Abstracts_Model');

            if(self.id > 0){
                _url = _url + 'id/' + self.id;
            }

            self.status = self.PRE_DISPATCH;

            if(self._preDispatch()){
                _promise = $http({url:_url,method: "GET"})
                    .then(
                    function(response) {
                        self.status = self.POST_DISPATCH;
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '.find() response process','App_Common_Abstracts_Model');
                        if('model' in response.data){
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                            self.setFromArray(response.data.model);
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                        }
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self._postDispatch();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postFind()','App_Common_Abstracts_Model');
                        self._postFind();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postFind()','App_Common_Abstracts_Model');
                        self.status = self.READY;
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '.find() response process','App_Common_Abstracts_Model');

                        // return the response to support daisy chaining usage as required
                        return response;
                    },
                    function() {
                        self.status = self.POST_DISPATCH;
                        // error processed by App Interceptor
                        return $http.reject
                    }
                );
            }else{
                self.status = self.READY;
            }

            SysMan.Logger.entry('END '+self.constructor.name+'.find()','App_Common_Abstracts_Model');

            return _promise;
        };

        /**
         * Generic save method for the model.  Executes a PUT action to backend.  This may result in saving information
         * to multiple tables as dictated by the mapper side of the ORM model.  On the frontend side, save always
         * implements a “put” action to the backend.  The backend determines if save is an “update” given the presence
         * of the “id” property, or a “create” operation, otherwise.  Upon successful return of data to the frontend,
         * the application will always set the model properties per the return, execute “_postDispatch()” logic,
         * then “_postSave()” logic, then set status as READY.
         *
         * @method   save
         * @public
         * @return	{promise}   - Since this is an asynchronous request, a promise allows for reaction once response
         * returns from backend in lieu of or in addition to using the "_postSave()" method.
         */
        App_Common_Abstracts_Model.prototype.save = function(){
            // proxy this so it does not get lost in the promise
            var self = this;
            var _url = self._rootURL;
            var _request = {
                url: _url,
                method: "PUT",
                data: {
                    //model:  _getPostProps(self)
                    model:  self.toJSON(true)
                }
            };
            var _promise = null;

            self.SysMan.Logger.entry('START ' + self.constructor.name + '.save()','App_Common_Abstracts_Model');


            // record associated model status
            self.status = self.PRE_DISPATCH;

            if(self._preDispatch()) {
                _promise = $http(_request)
                    .then(
                    function(response) {
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '.save() response process','App_Common_Abstracts_Model');
                        self.status = self.POST_DISPATCH;
                        if('model' in response.data){
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                            self.setFromArray(response.data.model);
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                        }
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self._postDispatch();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postSave()','App_Common_Abstracts_Model');
                        self._postSave();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postSave()','App_Common_Abstracts_Model');
                        self.status = self.READY;
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '.save() response process','App_Common_Abstracts_Model');

                        // return the response to support daisy chaining usage as required
                        return response;
                    },
                    function() {
                        // error processed by App Interceptor
                        self.status = self.POST_DISPATCH;
                        return $http.reject;
                    }
                );
            }else{
                self.status = self.READY;
            }

            self.SysMan.Logger.entry('END ' + self.constructor.name + '.save()','App_Common_Abstracts_Model');

            return _promise;
        };

        /**
         * Serves as a relay conduit from frontend to backend for continuation of method logic.  The model state is
         * always relayed to the backend.  The frontend transfers ONLY the model properties that are not itemized as
         * excluded with the “excludeFromPost()” method. Any method can be relayed to the backend for processing.
         * Upon asynchronous return from backend, this method sets the model properties with the associated data, runs
         * the “_postDispatch()” global method and then the more specific “_post<METHOD>”, whereby <METHOD> is the name
         * of the specific method passed as an argument.  When running the specific “_post” method, the associative
         * array of results from the backend are passed as the argument to the method.  If there is not a specific
         * “_post” method defined, it runs the generic “_postRelay()” method passing the results as an argument.
         *
         * @method   relay
         * @param   {string}        method      - method to relay to the backend
         * @param   {boolean}       noModel     - flags backend not to return model
         * @param   {object}        args        - object representing the arguments associated with the method
         * @public
         */
        App_Common_Abstracts_Model.prototype.relay = function(method,noModel,args){
            // proxy this so it does not get lost in the promise
            var self = this;

            //var _scope = $scope;
            var _request = {
                url: self._rootURL,
                method: "POST",
                data: {
                    //model:  _getPostProps(self),
                    model:  self.toJSON(true),
                    method: method,
                    args:   args
                }
            };
            var _promise = null;

            if(noModel){
                _request.data['noModel'] = true;
            }

            self.SysMan.Logger.entry('START ' + self.constructor.name + '.relay() for method = '+method,'App_Common_Abstracts_Model');

            // record associated model status
            self.status = self.PRE_DISPATCH;

            if(self._preDispatch()) {
                _promise = $http(_request)
                    .then(
                    function(response) {
                        self.SysMan.Logger.entry(
                            'START ' + self.constructor.name + '.relay() response process for method ' + response.data.method + '()',
                            'App_Common_Abstracts_Model'
                        );
                        /*
                         * @var {ResponseDataType}    response.data
                         */
                        self.status = self.POST_DISPATCH;
                        if('model' in response.data){
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                            self.setFromArray(response.data.model);
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                        }
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self._postDispatch();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        try{
                            // run the specific post method follow-up if defined
                            var _method = '_post'+_ucFirst(response.data.method);
                            self.SysMan.Logger.entry(
                                'START ' + self.constructor.name + '.' + _method + '()',
                                'App_Common_Abstracts_Model'
                            );
                            self[_method](response.data.results);
                            self.SysMan.Logger.entry(
                                'END ' + self.constructor.name + '.' + _method + '()',
                                'App_Common_Abstracts_Model'
                            );
                        }
                        catch(err) {
                            self.SysMan.Logger.entry(
                                'START ' + self.constructor.name + '._postRelay since no specific _post'
                                +_ucFirst(response.data.method)+' method found, error = ' + err.message,'App_Common_Abstracts_Model');
                            self._postRelay(response.data.results);
                            self.SysMan.Logger.entry(
                                'END ' + self.constructor.name + '._postRelay','App_Common_Abstracts_Model');
                        }
                        self.status = self.READY;

                        self.SysMan.Logger.entry(
                            'END ' + self.constructor.name + '.relay() response process for method ' + response.data.method + '()',
                            'App_Common_Abstracts_Model'
                        );

                        // return the response to support daisy chaining usage as required
                        return response;
                    },
                    function() {
                        // error processed by App Interceptor
                        self.status = self.POST_DISPATCH;
                        return $http.reject;
                    }
                );
            }else{
                self.status = self.READY;
            }

            self.SysMan.Logger.entry('END ' + self.constructor.name + '.relay() for method = '+method,'App_Common_Abstracts_Model');

            return _promise;
        };

        /**
         * Executes delete request to data source based on “id” property.  This is typically for delete of associated
         * model records, but it is also useful for servicing logout request whereby the backend must terminate the session
         * and hence it will not be available for logging and other common followups to the request.
         *
         * @method   remove
         * @public
         * @return  {promise}
         */
        App_Common_Abstracts_Model.prototype.remove = function(){
            // proxy this so it does not get lost in the promise
            var self = this;
            var _url = self._rootURL;
            var _promise = null;

            SysMan.Logger.entry('START '+self.constructor.name+'.remove()','App_Common_Abstracts_Model');

            self.status = self.PRE_DISPATCH;

            if(self._preDispatch()){
                /**
                 * @function $http
                 * @param   {{url:string,data:{id:int},method:string}}
                 * @return {promise}
                 * @private
                 */
                _promise = $http({url:_url,data: {id: self.id},method: "DELETE"})
                    .then(
                    function(response) {
                        self.status = self.POST_DISPATCH;
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '.remove() post dispatch','App_Common_Abstracts_Model');
                        if('model' in response.data){
                            self.SysMan.Logger.entry('START ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                            self.setFromArray(response.data.model);
                            self.SysMan.Logger.entry('END ' + self.constructor.name + '.setFromArray() based on response data','App_Common_Abstracts_Model');
                        }
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self._postDispatch();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postDispatch()','App_Common_Abstracts_Model');
                        self.SysMan.Logger.entry('START ' + self.constructor.name + '._postRemove()','App_Common_Abstracts_Model');
                        self._postRemove();
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '._postRemove()','App_Common_Abstracts_Model');
                        self.status = self.READY;
                        self.SysMan.Logger.entry('END ' + self.constructor.name + '.remove() post dispatch','App_Common_Abstracts_Model');

                        // return the response to support daisy chaining usage as required
                        return response;
                    },
                    function() {
                        self.status = self.POST_DISPATCH;
                        // error processed by App Interceptor
                        return $http.reject
                    }
                );
            }else{
                self.status = self.READY;
            }

            SysMan.Logger.entry('END '+self.constructor.name+'.remove()','App_Common_Abstracts_Model');

            return _promise;
        };

        /**
         * Sets model properties based on provided associative array
         *
         * @method  setFromArray
         * @public
         * @param {object}  propArray    - JSON array indexed by property name
         * @param {string}  propArray.idTag - DOM tag for model
         * @param {int}     propArray.id    - model primary key
         *
         */
        App_Common_Abstracts_Model.prototype.setFromArray = function(propArray){
            // check to make sure argument is an array object
            if(typeof propArray === 'object'){
                // first set the id and idTag properties in order to initialize the DOM property, which other setters may depend upon
                if(propArray.id){
                    this.id = propArray.id;
                    delete propArray.id;
                    if(propArray.idTag){
                        this.idTag = propArray.idTag;
                        delete propArray.idTag;
                    }
                }
                // set properties per argument passed during construction
                for(var $key in propArray){
                    // set property if it exists anywhere in prototype chain, hasOwnProperty only checks the object itself
                    if($key in this){
                        // use self reference in order to execute setter method, call using bracket notation within object scope
                        if(propArray[$key] !== null){
                            this[$key] = propArray[$key];
                        }
                    }else{
                        // check for lower case version of property
                        if(_lcFirst($key) in this){
                            if(propArray[$key] !== null){
                                this[_lcFirst($key)] = propArray[$key];
                            }
                        }else{
                            // log non-existent property
                            SysMan.Logger.entry(
                                'Property '+$key+' does not exist.',
                                this.constructor.name,
                                SysMan.Logger.TYPE.ERROR,
                                SysMan.Logger.ERRNO.MODEL_ERROR
                            )
                        }
                    }
                }
            }else{
                var _msg = 'Model.setFromArray() operation failed for object = ' + this.constructor.name +
                    '.  Expected JS object mapping property to value, but it was not.  The value follows:';
                SysMan.Logger.entry(_msg,'App_Common_Abstracts_Model',SysMan.Logger.TYPE.ERROR,SysMan.Logger.ERRNO.MODEL_GET_ERROR);
            }

        };

        var _excludeFromPost = [];
        /**
         * Adds itemized properties to the exclusion list for "POST" or "PUT" operations to the backend.
         *
         * @method   excludeFromPost
         * @public
         * @param    {string[]}  props           - array of properties to exclude from post
         */
        App_Common_Abstracts_Model.prototype.excludeFromPost = function(props){
            if(typeof this.uid == 'undefined'){
                SysMan.Logger.entry('Tried to access model ' + this.constructor.name + ' before the abstract was extended.',
                    this.constructor.name,SysMan.Logger.TYPE.ERROR, SysMan.Logger.ERRNO.MODEL_ERROR);
            }else{
                if(!(this.uid in _excludeFromPost)){
                    _excludeFromPost[this.uid] = props;
                }else{
                    for(var i = 0;i<props.length;i++){
                        if(_excludeFromPost[this.uid].indexOf(props[i]) < 0){
                            _excludeFromPost[this.uid].push(props[i]);
                        }
                    }
                }
            }

        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Removes first message from msg property array of messages
         *
         * @method   removeMsg
         * @public
         * @param    {int}      index       - index to remove
         * @return   {boolean}
         */
        App_Common_Abstracts_Model.prototype.removeMsg = function(index){
            if(index < this.msg.length){
                this.msg.splice(index, 1);
                return true;
            }else{
                return false;
            }
        };

        /**
         * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
         * logic to implement after backend returns information.
         *
         * @method   _postFind
         * @protected
         */
        App_Common_Abstracts_Model.prototype._postFind = function(){
            // TODO:  Overwrite during creation of a specific model
        };

        /**
         * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
         * logic to implement after backend returns from relay() method.  This is the generic response to a relay
         * operation.  If the specific Model define a “_postXXX” method associated with the relay, then this method
         * does not run.
         *
         * @method      _postRelay
         * @protected
         * @param       {object}  results     - JSON object containing the results from the relayed method
         * @return      {boolean}
         */
            //noinspection
        App_Common_Abstracts_Model.prototype._postRelay = function(results){
            return true;
        };

        /**
         * Prototype shell for running model logic after save returns
         *
         * @method   _postSave
         * @protected
         */
        App_Common_Abstracts_Model.prototype._postSave = function(){
            // TODO:  Overwrite during creation of a specific model
        };

        /**
         * Prototype shell for running model logic after remove method returns
         *
         * @method   _postRemove
         * @protected
         */
        App_Common_Abstracts_Model.prototype._postRemove = function(){
            // TODO:  Overwrite during creation of a specific model
        };

        /**
         * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
         * logic to implement before the frontend executes any request to the backend.  If the method returns “false”,
         * the Model will not execute the backend request.
         *
         * @method   _preDispatch
         * @public
         * @return   {boolean}
         */
        App_Common_Abstracts_Model.prototype._preDispatch = function(){
            return true;
        };

        /**
         * Protoype shell for model logic that should follow any request returning from backend
         *
         * @method   _postDispatch
         * @public
         * @return   {boolean}
         */
        App_Common_Abstracts_Model.prototype._postDispatch = function(){
            // TODO:  Overwrite during creation of a specific model
        };

        /*********************************************
         * PRIVATE FUNCTIONS (shared at Factory level)
         *********************************************/
        /**
         * Creates a unique id for each instance of a Model
         *
         * @function    _nextUid
         * @private
         * @returns {number}
         */
        function _nextUid(){
            return ++_uidCount;
        }
        /**
         * Applies lower case to the initial letter of the string passed as a parameter
         *
         * @function    _lcFirst
         * @private
         * @param   {string}    x       - the string to apply lower case
         * @returns {string}            - the string with the initial letter in lower case
         */
        function _lcFirst(x){
            return x.charAt(0).toLowerCase() + x.slice(1);
        }
        /**
         * Applies upper case to the initial letter of the string passed as a parameter
         *
         * @function    _ucFirst
         * @private
         * @param   {string}    x       - the string to apply lower case
         * @returns {string}            - the string with the initial letter in lower case
         */
        function _ucFirst(x){
            return x.charAt(0).toUpperCase() + x.slice(1);
        }

        function _processArray(arr,scrubExcludes){
            var _tmp = [];
            for(var j=0;j<arr.length;j++){
                if(arr[j] instanceof App_Common_Abstracts_Model){
                    _tmp.push(arr[j].toJSON(scrubExcludes));
                }else if(Object.prototype.toString.call(arr[j]) === '[object Array]'){
                    _tmp.push(_processArray(arr[j],scrubExcludes));
                }else{
                    _tmp.push(arr[j]);
                }
            }

            return _tmp;
        }

        // return constructor for dependency injection and extension of class, prefix with "new" if it should be a singleton
        return App_Common_Abstracts_Model;
    }

    // todo: inject dependenciesObject
    App_Common_Abstracts_ModelFactory.$inject = [
        'App_Common_Models_SysMan',
        '$http',
        'App_Common_Models_Message'
    ];

    // todo: register model with Angularjs application for dependency injection as required
    angular.module('App_Common').factory('App_Common_Abstracts_Model', App_Common_Abstracts_ModelFactory);
})();
