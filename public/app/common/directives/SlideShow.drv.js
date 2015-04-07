(function () {

    //todo:  reference newly injected dependencies as needed
    function SlideShowDirective(Logger,$interval) {

        function SlideShow() {
            var self = this;

            Logger.entry('START constructor','SlideShowDirective');

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            self.restrict = 'E';    // element name type directive
            self.templateUrl = '/app/common/directives/SlideShow.drv.html';
            self.scope = {
                pages:      '=',        // array of Page models
                dwell:      '='         // milli-seconds to show each page
            };
            self.link = controller;

            //self.scope.pages = null;        // initialize to null

            /**
             *
             * @param   {Object}                    scope           - reference to angular directive scope
             * @param   {WordShuffle_Models_Page[]} scope.pages     - array of pages to display
             * @param   {string}                    scope.pageBody  - current page to display
             * @param   {Object}    element         - the DOM element attached to directive
             * @param   {Object}    attributes      - the actual attributes values passed within the directive DOM element
             */
            function controller(scope, element, attributes) {
                // wait for backend to load pages
                var _intervalId = $interval(wait, 100);
                var _i = 0;
                var _maxHt = 0;

                function wait(){
                    if(typeof scope.pages[_i] === 'undefined'){
                        // do nothing until pages have content
                    }else{
                        // as soon as pages load from backend, display in directive
                        scope.pageBody = scope.pages[_i].body;    // initialize page display to the first page

                        // change interval callback to update slide page, reflect directive dwell time
                        $interval.cancel(_intervalId);
                        _intervalId = $interval(updateSlide, scope.dwell);
                    }
                }

                function updateSlide() {
                    _i = _i + 1;
                    if(_i >= scope.pages.length){
                        _i = 0;
                    }

                    scope.pageBody = scope.pages[_i].body;

                    // set the container height as dictated by the longest page in order to stop page from bouncing
                    if(element.height() > _maxHt){
                        _maxHt = element.height();
                        element.parent().css('height',element.css('height'));
                    }
                }

                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });
                // todo:  use "ng_drv_func" live template to extended the directive scope with another function
            }

            Logger.entry('END constructor','SlideShowDirective');

            return self;
        }

        return new SlideShow;
    }

    // todo:  inject new dependencies into directive as needed
    SlideShowDirective.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App').directive('appCommonDirectivesSlideShow', SlideShowDirective);
})();