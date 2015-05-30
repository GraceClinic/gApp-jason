/**
 * File: routes2
 * User: jderouen
 * Date: 1/7/15
 * Time: 12:48 PM
 * To change this template use File | Settings | File Templates.
 */

angular.module('App')
    .config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    console.log('START App_Configs_Routes construct');

    // redirect and establish catch all fallback
    $urlRouterProvider
        .when('/','/m/wordshuffle/welcome/index')
        .when('/m/wordshuffle','/m/wordshuffle/welcome/index')
        .when('/m/wordshuffle/','/m/wordshuffle/welcome/index')
        .when('/m/:module/:controller','/m/:module/:controller/index')
        .when('/m/:module/:controller/','/m/:module/:controller/index')
        .otherwise('/m/wordshuffle/welcome/index');

    $stateProvider
        .state('module',{
            url: '/m/:module',
            templateUrl: function(param){
                console.log('Load layout for module = ',param.module);
                return 'app/modules/' + param.module + '/views/Layout.tpl.html';
            }
        })
        .state('module.controller',{
            url: '/:controller',
            templateUrl: function(param){
                console.log('Load template for controller = ',param.controller);
                return 'app/modules/'+param.module+'/views/'+param.controller+'.tpl.html';
            }
        })
        .state('module.controller.action',{
            url: '/:action',
            templateUrl: function(param){
                console.log('Load template for action = ',param.action);
                return 'app/modules/'+param.module+'/views/'+param.controller+'/'+param.action+'.tpl.html';
            }
        });

    console.log('END App_Configs_Routes construct');

}]);