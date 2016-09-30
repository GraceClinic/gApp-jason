(function(){
    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @param {object}  $interval   - reference to AngularJS $interval object
     * @returns {appCommonDirectivesBanner}
     */
    function appCommonDirectivesBannerProvider(Logger,$interval){
        /**
         * Displays message bar across top of a DIV element that houses it.  During construction, the banner
         * directive sets a watcher on the "msg" property.  If the property is non-null, the banner will display each
         * message in the array for the time defined by "expires".  After it displays each message, it is removed from the
         * "msg" array.  When there are no messages remaining, the banner fades to invisible.
         *
         * @class appCommonDirectivesBanner
         * @returns {appCommonDirectivesBanner}
         */
        function appCommonDirectivesBanner(){
            Logger.entry('START appCommonDirectivesBanner.construct()','App_Common_Directives_Banner');

            this.restrict = 'E'; // match on element name only
            this.templateUrl = '/app/common/directives/Banner.drv.html';
            this.scope = {
                msg:        '=',        // array of msg objects with keys "text" and "type" defining the properties
                expires:    '='
            };
            this.link = controller;

            /**
             * Controller for the Banner object
             *
             * @param   {Object}    scope               - reference to angular directive scope for Banner
             * @param   {App_Common_Models_Message[]}  scope.msg   - array of message objects to display
             * @param   {int}       scope.expires       - milliseconds to display each message before switching to next one
             * @param   {Object}    element             - the DOM element attached to directive
             */
            function controller(scope, element){
                // proxy scope to self for consistency and use of templates for defining methods
                var self = scope;

                var _expiresAt = null;
                var _fade = 0.05;       // fade last message by 5% for each update window
                var _opacity = 1.0;     // initial opacity level of banner

                var _intervalId;        // defines interval callback for fading banner when message expires

                /****************************
                 * PUBLIC METHODS DEFINITION
                 ****************************/
                /**
                 * Immediately removes the active message from the "msg" array.  If there are no more messages, the method hides the
                 * banner, otherwise the next message displays as appropriate.
                 *
                 * @method
                 * @public
                 */
                self.closeMsg = function() {
                    self.msg.shift();
                    if(self.msg.length > 0){
                        // show next message
                        _expiresAt = Date.now() + self.expires;
                    }else{
                        element.hide();
                    }
                };

                /********************
                 * PRIVATE FUNCTIONS
                 ********************/
                function _processNewMsg(){
                    // initialize message presentation
                    if(typeof self.msg != 'undefined' && self.msg.length > 0){
                        element.show();
                        _expiresAt = Date.now() + self.expires;
                        if(_intervalId != null){
                            // cancel any currently active processing
                            if(!_intervalId.cancelled){
                                $interval.cancel(_intervalId);
                            }
                        }
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
                    if(typeof self.msg != 'undefined' && self.msg.length > 0){
                        element.show();
                        if(self.msg[0].constructor.name != 'App_Common_Models_Message'){
                            Logger.entry(
                                'Banner.msg not instance of App_Common_Models_Message',
                                'appCommonDirectivesBanner',
                                Logger.TYPE.ERROR);
                        }
                        if(Date.now() > _expiresAt){
                            if(self.msg.length == 1){
                                //fade last message
                                _opacity = Number($(element.children()[0]).css('opacity'));
                                _opacity = Math.round((_opacity - _fade)*100)/100;
                                $(element.children()[0]).css('opacity',_opacity);
                                if(_opacity <= _fade){
                                    element.hide();
                                    $interval.cancel(_intervalId);
                                    self.msg.shift();
                                }
                            }else if(self.msg.length > 1){
                                _opacity = 1.0;
                                self.msg.shift();
                                if(self.msg.length > 0){
                                    // show next message
                                    _expiresAt = Date.now() + self.expires;
                                }else{
                                    element.hide();
                                    $interval.cancel(_intervalId);
                                }
                            }else{
                                $interval.cancel(_intervalId);
                            }
                        }
                    }else{
                        element.hide();
                        $interval.cancel(_intervalId);
                    }
                }

                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                // watch messages for new content and process accordingly
                scope.$watch('msg',_processNewMsg,true);

                // clean up listener functions
                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });
            }

            Logger.entry('END appCommonDirectivesBanner.construct()','App_Common_Directives_Banner');

            return this;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new appCommonDirectivesBanner;
    }

    // inject dependenciesObject
    appCommonDirectivesBannerProvider.$inject = [
        'App_Common_Models_Tools_Logger',
        '$interval'
    ];

    angular.module('App_Common').directive('appCommonDirectivesBanner',appCommonDirectivesBannerProvider);
})();