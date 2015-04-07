/**
 * File: errorInterceptor
 * User: jderouen
 * Date: 2/16/15
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */
(function(){

    function App_InterceptorFactory($q,$injector,Logger){

        function App_Interceptor(){
            var self = this;

//            // optional method
//            self.request = function(config) {
//                // do something on success
//                return config;
//            };
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
                    Logger.errMsg = 'Non-compliant response format.  Should be JSON object.  Inspect response in FireBug.';

                    Logger.entry(
                        response.status + ' ' + response.statusText
                            + ':  Non-compliant response format.  Should be JSON object.  Inspect response in FireBug.',
                        'App_Interceptor',
                        Logger.TYPE.ERROR,
                        Logger.ERRNO.APP_ERROR
                    );
                }

                return response;
            };

            self.responseError = function(rejection) {
                Logger.errMsg = rejection.data.message;

                Logger.entry(
                    rejection.status + ' ' + rejection.statusText + ':  ' + rejection.data.message,
                    'App_Interceptor',
                    Logger.TYPE.ERROR,
                    Logger.ERRNO.APP_ERROR
                );

                // ripple the rejection down so the specific model using $http can service as desired
                return $q.reject(rejection);
            }

        }

        return new App_Interceptor();
    }

    App_InterceptorFactory.$inject = ['$q','$injector','App_Common_Models_Tools_Logger'];

    angular.module('App')
        .factory('App_Interceptor',App_InterceptorFactory)
        .config(['$httpProvider',function($httpProvider){
            $httpProvider.interceptors.push('App_Interceptor');
        }]);

})();