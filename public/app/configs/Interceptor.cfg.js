/**
 * File: errorInterceptor
 * User: jderouen
 * Date: 2/16/15
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */
(function(){

    function App_InterceptorFactory(Logger){
        var _log = [];
        var _tripped = false;

        function App_Interceptor(){
            var self = this;

            // track number of request
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
                // error out if excessive requests over past 20 seconds
                if(_count > 40 && !_tripped){
                    _tripped = true;
                    Logger.errMsg = 'Excessive requests to the backend!';

                    Logger.entry(
                        'Excessive requests to the backend!',
                        'App_Interceptor',
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

            self.response = function(response) {
                // check to see if backend returned a JSON object
                if(typeof response === 'object'){
                    // response format is OK
                }else{
                    if(!_tripped){
                        _tripped = true;
                        Logger.errMsg = 'Non-compliant response format.  Should be JSON object.  Inspect response in FireBug.';

                        Logger.entry(
                            response.status + ' ' + response.statusText
                            + ':  Non-compliant response format.  Should be JSON object.  Inspect response in FireBug.',
                            'App_Interceptor',
                            Logger.TYPE.ERROR,
                            Logger.ERRNO.APP_ERROR
                        );
                    }

                }

                return response;
            };

            self.responseError = function(rejection) {
                if(!_tripped){
                    Logger.errMsg = rejection.data.message;

                    Logger.entry(
                        rejection.status + ' ' + rejection.statusText + ':  ' + rejection.data.message,
                        'App_Interceptor',
                        Logger.TYPE.ERROR,
                        Logger.ERRNO.APP_ERROR
                    );
                }

                // above error entry will toggle error state change, return rejection information
                return rejection;
                // ripple the rejection down so the specific model using $http can service as desired
                //return $q.reject(rejection);
            }

        }

        return new App_Interceptor();
    }

    App_InterceptorFactory.$inject = ['App_Common_Models_Tools_Logger'];

    angular.module('App')
        .factory('App_Interceptor',App_InterceptorFactory)
        .config(['$httpProvider',function($httpProvider){
            $httpProvider.interceptors.push('App_Interceptor');
        }]);

})();