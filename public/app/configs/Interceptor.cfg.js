/**
 * File: Interceptor
 * User: jderouen
 * Date: 2/16/15
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */
(function(){

    /**
     *
     * @param $q
     * @param Logger
     * @returns {App_Configs_Interceptor}
     */
    function App_Configs_InterceptorFactory($q,Logger){
        var _log = [];
        var _tripped = false;

        /**
         * @class App_Configs_Interceptor
         *
         * Central processor of HTML requests and responses.  This object utilizes the App_Common_Models_Tools_Logger to record
         * an application error if there are too many requests to the backend.
         *
         **/
        function App_Configs_Interceptor(){
            var self = this;

            /**
             * @method request
             * Processes HTML request before being sent to the backend.  This method monitors the number of request to the backend
             * over the past 10 seconds.  If there are more than 100, the method reports an application error to the Logger object.
             *
             * @param       config      {object}    - the AngularJS $http config object
             * @return      {object}                - the AngularJS $http config object
             **/
            self.request = function(config) {
                // do something on success
                var _now = new Date();
                _log.push(_now);
                var _count = 0;
                var _diff = 0;
                var i = _log.length;
                while(i--){
                    _diff = _now - _log[i];
                    // remove log entries older than 10 seconds
                    if(_diff > 10000){
                        _log.splice(i,1);
                    }else{
                        _count++;
                    }
                }
                // error out if excessive requests over past 10 seconds
                if(_count > 100 && !_tripped){
                    _tripped = true;
                    Logger.entry(
                        'Excessive requests to the backend!',
                        'App_Configs_Interceptor',
                        Logger.TYPE.ERROR,
                        Logger.ERRNO.APP_ERROR
                    );
                }

                return config;
            };
//
//            // optional method
//            self.requestError = function(rejection) {
//                // do something on error
//                if (canRecover(rejection)) {
//                    return responseOrNewPromise
//                }
//                return $q.reject(rejection);
//            };
//
//            // optional method

            /**
             * @method response
             * Processes all HTML responses from the backend.  If the response is not in the form of a JSON object, the method
             * reports an application error to the Logger object.
             *
             * @param       response    {object}    - the AngularJS $http response object
             * @return      {object}    - the AngularJS $http config object
             **/
            self.response = function(response) {
                // check to see if backend returned a JSON object
                if(typeof response === 'object'){
                    // response format is OK
                }else{
                    if(!_tripped){
                        _tripped = true;
                        Logger.entry(
                            response.status + ' ' + response.statusText
                            + ':  Non-compliant response format.  Should be JSON object.  Inspect response in FireBug.',
                            'App_Configs_Interceptor',
                            Logger.TYPE.ERROR,
                            Logger.ERRNO.APP_ERROR
                        );
                    }

                }

                return response;
            };

            /**
             * @method responseError
             * Processes all HTML error responses from the backend.  If the method has not already processed a previous error, the
             * method will report the error state to the Logger for proper response.
             *
             * @param       rejection   {object}   the AngularJS rejection promise associated with the error
             * @return      {Promise}   the promise created from the $q.reject method to use in forwarding down a chain of
             *                          promises as applicable to downstream objects awaiting a response.
             **/
            self.responseError = function(rejection) {
                if(!_tripped){
                    _tripped = true;

                    Logger.entry(
                        rejection.status + ' ' + rejection.statusText + ':  ' + rejection.data.message,
                        'App_Configs_Interceptor',
                        Logger.TYPE.ERROR,
                        Logger.ERRNO.APP_ERROR
                    );
                }

                // above error entry will toggle error state change, return rejection information
                //return rejection;
                // ripple the rejection of the promise down so the specific model using $http so that it can service as desired
                return $q.reject(rejection);
            }

        }

        return new App_Configs_Interceptor();
    }

    App_Configs_InterceptorFactory.$inject = ['$q','App_Common_Models_Tools_Logger'];

    angular.module('App')
        .factory('App_Configs_Interceptor',App_Configs_InterceptorFactory)
        .config(['$httpProvider',function($httpProvider){
            $httpProvider.interceptors.push('App_Configs_Interceptor');
        }]);

})();