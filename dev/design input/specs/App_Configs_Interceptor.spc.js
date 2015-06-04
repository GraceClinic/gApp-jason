/**
 * App_Configs_Interceptor Class
 *
 * Central processor of HTML requests and responses.  This object utilizes the App_Common_Models_Tools_Logger to record
 * an application error if there are too many requests to the backend.
 *
 * @param       $q          {promise}                           reference to angularjs service
 * @param       Logger      {App_Common_Models_Tools_Logger}    reference to the application Logger singleton
 * @returns     {App_Configs_Interceptor}                       returns the interceptor singleton
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property
 *
 *
 * @type        {}
 * @public
 */

/**
 * PUBLIC METHODS
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 */
/**
 * @method request
 * Processes HTML request before being sent to the backend.  This method monitors the number of request to the backend
 * over the past 10 seconds.  If there are more than 100, the method reports an application error to the Logger object.
 *
 * @param       config      {object}    - the AngularJS $http config object
 * @return      {object}                - the AngularJS $http config object
 **/
/**
 * @method response
 * Processes all HTML responses from the backend.  If the response is not in the form of a JSON object, the method
 * reports an application error to the Logger object.
 *
 * @param       response    {object}    - the AngularJS $http response object
 * @return      {object}    - the AngularJS $http config object
 **/
/**
 * @method responseError
 * Processes all HTML error responses from the backend.  If the method has not already processed a previous error, the
 * method will report the error state to the Logger for proper response.
 *
 * @param       rejection   {object}   the AngularJS rejection promise associated with the error
 * @return      {promise}   the promise created from the $q.reject method to use in forwarding down a chain of
 *                          promises as applicable to downstream objects awaiting a response.
 **/

/**
 * DETAILED SPECIFICATION
 *
 **/
 