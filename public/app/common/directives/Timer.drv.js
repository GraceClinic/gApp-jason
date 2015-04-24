(function () {

    //todo:  reference newly injected dependencies as needed

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @returns {commonDirectivesTimer}
     */
    function commonDirectivesTimerProvider(Logger,$interval) {

        /**
         * @class commonDirectivesTimer
         * @returns {commonDirectivesTimer}
         */
        function commonDirectivesTimer() {
            var self = this;

            Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            self.restrict = 'E';
            self.templateUrl = '/app/common/directives/Timer.drv.html';
            self.scope = {
                callOnTrip: '&',
                time: '='
            };
            self.link = controller;

            /**
             * Provides for logic that controls aspects of the directive based on construction and / or events
             *
             * @param   {Object}    scope           - reference to angular directive scope
             * @param   {Object}    element         - the DOM element attached to directive
             * @param   {Object}    attributes      - the actual attributes values passed within the directive DOM element
             */
            function controller(scope, element, attributes) {
                var _intervalId = $interval(tick, 100);

                // todo: provide initialization logic
                function tick() {
                    // todo:  define logic
                }
                
                // todo:  use "ng_drv_func" live template to extended the directive scope with another function
                scope.start= function() {
                    // todo:  define logic
                    console.log('Start Timer');
                };


            }

            Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);

            return self;
        }

        return new commonDirectivesTimer;
    }

    // todo:  inject new dependencies into directive as needed
    commonDirectivesTimerProvider.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App').directive('commonDirectivesTimer', commonDirectivesTimerProvider);
})();