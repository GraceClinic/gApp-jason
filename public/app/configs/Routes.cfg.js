(function(){

    /**
     * @class       App_Configs_Routes
     * @param   {object}    $urlRouterProvider
     */
    function App_Configs_Routes($urlRouterProvider,$stateProvider){

        console.log('START App_Configs_Routes construct');

        // redirect and establish catch all fallback
        //$urlRouterProvider
        //    .when('/','/m/main/index/index');
            // given module and no controller, go to main index
            //.when('/m/main/','/m/main/index/index')
            //.when('/m/:module','/m/main/index/index')
            //.when('/m/:module/','/m/main/index/index')
            //// given module and controller, but not action, go to controller index
            //.when('/m/:module/:controller','/m/:module/:controller/index')
            //.when('/m/:module/:controller/','/m/:module/:controller/index')
            //.otherwise('/m/main/index/index');

        $stateProvider
            .state('module',{
                url: '/m/:module',
                abstract: true,
                templateUrl: function(param){
                    if(param.module !== ""){
                        console.log('Load layout for this module = ',param.module);
                        return 'app/modules/' + param.module + '/views/Layout.tpl.html';
                    } // else onEnter will route to appropriate state
                }
            })
            .state('module.controller',{
                url: '/:controller',
                abstract: true,
                templateUrl: function(param){
                    if(param.controller !== ""){
                        console.log('Load template for controller = ',param.controller);
                        return 'app/modules/'+param.module+'/views/'+param.controller+'.tpl.html';
                    } // else onEnter will route to appropriate state
                }
            })
            .state('module.controller.action',{
                url: '/:action',
                templateUrl: function(param){
                    if(param.action !== ""){
                        console.log('Load template for action = ',param.action);
                        return 'app/modules/'+param.module+'/views/'+param.controller+'/'+param.action+'.tpl.html';
                    } // else onEnter will route to appropriate state
                },
                // defaults if parameters not defined
                params:{
                    module:{value:"",squash:true},
                    controller:{value:"",squash:true},
                    action:{value:"",squash:true}
                },
                onEnter: ['$state','$stateParams',function($state,$stateParams){
                    var _actionEmpty = $stateParams.action == "";
                    var _ctrlEmpty = $stateParams.controller == "";
                    var _modEmpty = $stateParams.module == "";

                    var _newState = {module:$stateParams.module,controller:$stateParams.controller,action:$stateParams.action};
                    var _routeMe = false;

                    console.log('START state.OnEnter, params = ',_newState);
                    // route to index action if not defined
                    if(_modEmpty){
                        _newState.module = 'main';
                        _newState.controller = 'index';
                        _newState.action = 'index';
                        _routeMe = true;
                    }else if(_ctrlEmpty){
                        _newState.controller = 'welcome';
                        _newState.action = 'index';
                        _routeMe = true;
                    }else if(_actionEmpty){
                        _newState.action = 'index';
                        _routeMe = true;
                    }
                    
                    if(_routeMe){
                        console.log('State incomplete, goto = ',_newState);
                        $state.go('module.controller.action',_newState);
                    }
                }]
            });

        console.log('END App_Configs_Routes construct');
    }

    App_Configs_Routes.$inject = [
        '$urlRouterProvider',
        '$stateProvider'
    ];

    angular.module('App').config(App_Configs_Routes);

})();
