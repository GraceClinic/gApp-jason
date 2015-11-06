(function(){
    /**
     * @class App_Module
     * The WordShuffle module.  Encapsulates all controllers, models, and directives that create the WordShuffle game.
     *
     * Dependency injections:
     * @param   ui.router   {object}    reference to angularjs ui.router module
     * @param   ngSanitize  {object}    reference to angularjs ngSanitize module
     *
     **/
    angular.module('App_Memory',['ui.router','ngSanitize','App_Main'])
        .config(App_Memory_Config);     // create angular Module for usage

    /**
     * Configuration of Memory module state machine
     *
     * @param   {object}    $urlRouterProvider
     * @param   {object}    $stateProvider
     * @param   {object}  SysManProvider
     */
    function App_Memory_Config($urlRouterProvider, $stateProvider, SysManProvider){

        // redirect and establish catch all fallback
        $urlRouterProvider
            .when('/m/memory','/m/memory/welcome/index')
            .when('/m/memory/','/m/memory/welcome/index')
            // given module and no controller, go to main index
            //.when('/m/:module','/m/main/index/index')
            //.when('/m/:module/','/m/main/index/index')
            //// given module and controller, but not action, go to controller index
            //.when('/m/:module/:controller','/m/:module/:controller/index')
            //.when('/m/:module/:controller/','/m/:module/:controller/index')
            .otherwise('/m/main/index/index');
        
        $stateProvider
            // specific state control
            .state('Memory',{
                url: '/m/memory',
                templateUrl: 'app/modules/memory/views/Layout.tpl.html'
            })
            .state('Memory.Welcome',{
                url: '/welcome',
                templateUrl: 'app/modules/memory/views/Welcome.tpl.html'
            })
            .state('Memory.Welcome.Index',{
                url: '/index',
                templateUrl: 'app/modules/memory/views/welcome/Index.tpl.html'
            })
            .state('Memory.Play',{
                url: '/play',
                templateUrl: 'app/modules/memory/views/Play.tpl.html'
            })
            .state('Memory.Play.Index',{
                url: '/index',
                templateUrl: 'app/modules/memory/views/play/Index.tpl.html',
                controller: 'Memory_Controllers_Play',
                //resolve: {
                //    resolved: function(SysManProvider){
                //        SysManProvider.$get().msg = {
                //            type: 'INFO',
                //            text: 'Message from Play.index resolve'
                //        };
                //        return true;
                //    }
                //},
                onEnter:['App_Common_Models_SysMan',function(SysMan){
                    SysMan.msg = {
                        type: 'INFO',
                        text: 'Message from Memory.Play.Index onEnter'
                    };
                }]
            })
    }

    /*
     Only Providers available to the configuration of an AngularJS module.  For all Factory definitions, AngularJS
     creates an empty Provider type with the $get() method available for accessing the provided object.  To inject
     this Provider, append "Provider" to the Factory name.  Hence, here we inject the SysManProvider by appending
     "Provider" to the model name.
     */
    App_Memory_Config.$inject = [
        '$urlRouterProvider',
        '$stateProvider',
        'App_Common_Models_SysManProvider'
    ];
})();
