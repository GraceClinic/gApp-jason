/**
 * App_Common_Abstracts_Model class
 *
 * Model superclass defines base properties and methods for all Model instances
 *
 * @extends     {Function}
 * @returns     {App_Common_Abstracts_Model}
 *
 * Dependency injections:
 * @param {function}        $http       Angularjs reference to HTTP object for servicing AJAX
 * @param {function(new:App_Common_Models_Message(data))|App_Common_Models_Message}   Message - message constructor
 *
 * Constructor parameters:
 * @param       {array} data        - Array of class properties for setting during instantiation
 *
 **/

/**
 * CONSTANTS
 * @constant PRE_DISPATCH   {string}    flag for model.status before dispatch to backend
 * @constant POST_DISPATCH  {string}    flag for model.status after dispatch returns
 * @constant READY          {string}    flag for model.status as ready
 */
/**
 * PROPERTIES
 * @property _rootURL	{string}	protected variable defining URL for query to backend for associated data (all
 *                                  AJAX methods depend upon this definition)
 * @property uid	    {int}	    unique number identify instance of Model
 * @property id 	    {int}	    primary key for Model for DB retrieval
 * @property idTag	    {string}	DOM id tag associated with Model
 * @property DOM	    {object} 	DOM object itself associated with Model
 * @property x	        {int}	    (optional) x location of object origin
 * @property y	        {int}	    (optional) y location of object origin
 * @property height	    {int}	    (optional) height of object (for animation)
 * @property width 	    {int}	    (optional) width of object (for animation)
 * @property SysMan	    {App_Common_Models_SysMan}
                                    reference to singleton instance of SysMan
 * @property properties {string[]}	array of Model properties (initial capital)
 * @property msg	    {{type:string,text:string}[]}
 *                                  stores messages as an array of objects with keys ("type","text")
 * @property status	    {enum}	    tracks status of Model based on request state to backend as one of the class
 *                                  constants:  PRE_DISPATCH, POST_DISPATCH, and READY
 **/

/**
 * METHODS
 * For save(), find(), delete(), and post() actions, the methods update the “status” property as PRE_DISPATCH when
 * request sent, POST_DISPATCH when request returns, and READY once processing completes based on any of the defined
 * “post” actions.  The “_preDispatch()” method mediates each of these methods query to the backend.  No method will
 * run if _preDispatch() returns as “false”.  From the frontend standpoint, prior to running _preDispatch, each method
 * sets the SysMan.state.action to the appropriate action at hand:  “put.create” and “put.update” for the save() method;
 * “get” or “index” for the find() method, “post.<method>” for the relay() method (where <method> is the name of the
 * specific relayed method.
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 **/
/**
 * @method  find()
 *
 * Retrieves model attributes from data source based on “id” property.  This may result in getting information
 * from multiple tables as dictated by the mapper side of the ORM model.  On the frontend side if “id” property
 * present, find establishes the id as a URL parameter and execute a “get” request.  Otherwise, find executes
 * an “index” request to the backend.  Backend proceeds to execute find operation.  Upon successful response
 * from backend, model executes "_postFind()" logic.
 *
 * @return	{promise}	- Since this is an asynchronous request, a promise allows for reaction once response returns from backend in lieue of or in addition to defining "_postFind()" logic.
 **/
/**
 * @method  save()
 *
 * Generic save method for the model.  Executes a PUT action to backend.  This may result in saving information
 * to multiple tables as dictated by the mapper side of the ORM model.  On the frontend side, save always
 * implements a “put” action to the backend.  The backend determines if save is an “update” given the presence
 * of the “id” property, or a “create” operation, otherwise.  Upon successful return of data to the frontend,
 * the application will always set the model properties per the return, execute “_postDispatch()” logic,
 * then “_postSave()” logic, then set status as READY.
 *
 * @return	{promise}   - Since this is an asynchronous request, a promise allows for reaction once response returns
 * from backend in lieu of or in addition to using the "_postSave()" method.
 **/
/**
 * @method  relay()
 *
 * Serves as a relay conduit from frontend to backend for continuation of method logic.  The model state is
 * always relayed to the backend.  The frontend transfers ONLY the model properties that are not itemized as
 * excluded with the “excludeFromPost()” method. Any method can be relayed to the backend for processing.
 * Upon asynchronous return from backend, this method sets the model properties with the associated data, runs
 * the “_postDispatch()” global method and then the more specific “_post<METHOD>”, whereby <METHOD> is the name
 * of the specific method passed as an argument.  When running the specific “_post” method, the associative
 * array of results from the backend are passed as the argument to the method.  If there is not a specific
 * “_post” method defined, it runs the generic “_postRelay()” method passing the results as an argument.
 *
 * @param   {string}        method      - method to relay to the backend
 * @param   {boolean}       noModel     - flags backend not to return model
 * @param   {object}        args        - object representing the arguments associated with the method
 *
 * @return	{promise}	- Since this is an asynchronous request, a promise allows for reaction once response returns from backend in lieue of or in addition to defining "_postRelay()" logic and/or "_post<METHOD>()" logic.
 **/
/**
 * @method  remove()
 * Executes delete request to data source based on “id” property.  This is typically for delete of associated
 * model records, but it is also useful for servicing logout request whereby the backend must terminate the session
 * and hence it will not be available for logging and other common followups to the request.
 *
 * @return	{promise}	- Since this is an asynchronous request, a promise allows for reaction once response returns from backend in lieue of or in addition to defining "_postDelete()" logic.
 **/
/**
 * @method  setFromArray()
 *
 * Sets model properties based on provided associative array
 *
 * @param {object}  propArray       - JSON array indexed by property name
 *
 **/
/**
 * @method  excludeFromPost()
 *
 * Adds itemized properties to the exclusion list for "POST" or "PUT" operations to the backend.
 *
 * @param   props	{string[]}  - array of properties to exclude
 **/
/**
 * @method  removeMsg()
 *
 * Removes first message from msg property array of messages
 *
 * @param   index	{int}   - index to remove from msg array
 * @return	{boolean}   - true if removed otherwise false
 **/
/**
 * @method  toJSON()
 *
 * Converts model to JSON object containing only the model properties
 *
 * @param    {boolean}   scrubExcludes  - flag to return only post properties
 * @return   {object}
 */
/**
 * @method  _postFind()
 *
 * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
 * logic to implement after backend returns information.
 *
 * @protected
 **/
/**
 * @method  _postRelay()
 *
 * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
 * logic to implement after backend returns from relay() method.  This is the generic response to a relay
 * operation.  If the specific Model define a “_postXXX” method associated with the relay, then this method
 * does not run.
 *
 * @protected
 * @param   results	    {object}    - JSON object of results returned from the backend
 **/
/**
 * @method  _postSave()
 *
 * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining logic to
 * implement after backend returns from save() method.
 *
 * @protected
 **/
/**
 * @method   _postRemove()
 *
 * Prototype shell for running model logic after remove method returns
 *
 * @protected
 */
/**
 * @method  _preDispatch()
 *
 * Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining
 * logic to implement before the frontend executes any request to the backend.  If the method returns “false”,
 * the Model will not execute the backend request.
 *
 * @protected
 * @return	{boolean}   - gates continuation of request
 **/
/**
 * @method  _postDispatch()
 * @protected
 *      Empty shell method intended to work as a “protected” method.  Intent is overwrite by specific Model defining logic to implement after any AJAX request returns from backend.  This is generic logic that should execute for any of the request operations.
 */
