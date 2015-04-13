/**
 * File: Core_Directives_Banner
 * User: jderouen
 * Date: 2/2/15
 * Time: 10:18 AM
 * To change this template use File | Settings | File Templates.
 */
(function(){

    function BannerDirective(Logger,$interval){

        function Banner(){
            Logger.entry('Constructor START','App_Common_Directives_Banner');
            var self = this;

            self.restrict = 'E'; // match on element name only
            self.templateUrl = '/app/common/directives/Banner.drv.html';
            self.scope = {
                msg:        '=',
                msgType:    '=',
                expires:    '='
            };
            self.link = controller;

            /**
             *
             * @param   {Object}    scope           - reference to angular directive scope for Banner
             * @param   {Object}    element         - the DOM element attached to directive
             */
            function controller(scope, element){
                var _expiresAt = null;
                var _fade = 0.05;       // fade last message by 5% for each update window
                var _opacity = 1.0;     // initial opacity level of banner

                var _intervalId;        // defines interval callback for fading banner when message expires

                // watch messages for new content and process accordingly
                scope.$watch('msg',_processNewMsg,true);

                // expand Banner scope to service user click of "close" link
                scope.closeMsg = function() {
                    scope.msg.shift();
                    if(scope.msg.length > 0){
                        // show next message
                        _expiresAt = Date.now() + scope.expires;
                    }else{
                        element.hide();
                    }
                };

                function _processNewMsg(){
                    // initialize message presentation
                    if(scope.msg.length > 0){
                        element.show();
                        _expiresAt = Date.now() + scope.expires;
                        _intervalId = $interval(_updateMsg, 100);
                    }else{
                        element.hide();
                    }
                }

                /**
                 * Updates display of messages to the banner.  Each is displayed for the time defined by the "expires"
                 * attribute.  When there are no more messages, the banner no longer displays
                 *
                 */
                function _updateMsg(){
                    if(scope.msg.length > 0){
                        element.show();
                        if(Date.now() > _expiresAt){
                            if(scope.msg.length == 1){
                                // fade last message
                                _opacity = Number(element.css('opacity'));
                                _opacity = Math.round((_opacity - _fade)*100)/100;
                                element.css('opacity',_opacity);
                                if(_opacity <= _fade){
                                    scope.msg.shift();
                                    element.hide();
                                }
                            }else{
                                _opacity = 1.0;
                                scope.msg.shift();
                                if(scope.msg.length > 0){
                                    // show next message
                                    _expiresAt = Date.now() + scope.expires;
                                }else{
                                    element.hide();
                                }
                            }
                        }
                    }else{
                        element.hide();
                        $interval.cancel(_intervalId);
                    }
                }

                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });
            }

            Logger.entry('Constructor END','App_Common_Directives_Banner');

            return self;
        }

        return new Banner;
    }

    // inject dependenciesObject
    BannerDirective.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App').directive('appCommonDirectivesBanner',BannerDirective);
})();