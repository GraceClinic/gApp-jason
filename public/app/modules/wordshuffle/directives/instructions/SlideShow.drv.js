(function () {

    /**
     * @param {App_Common_Models_Tools_Logger} Logger
     * @param $interval
     * @returns {wordshuffleDirectivesInstructionsSlideShow}
     */
    function wordshuffleDirectivesInstructionsSlideShowProvider(Logger,$rootScope,$interval) {

        /**
         * @class wordshuffleDirectivesInstructionsSlideShow
         * @returns {wordshuffleDirectivesInstructionsSlideShow}
         */
        function wordshuffleDirectivesInstructionsSlideShow() {
            var self = this;

            Logger.entry('START ' + self.constructor.name + '.construct()',self.constructor.name);

            self.restrict = 'E';    // element name type directive
            self.templateUrl = '/app/modules/wordshuffle/directives/instructions/SlideShow.drv.html';
            self.scope = {
                pages       :   '=',        // array of Page models
                dwell       :   '='   // milli-seconds to show each page
            };
            self.link = link;

            /**
             * Link for the SlideShow directive
             *
             * @param   {Object}                    scope           - reference to angular directive scope
             * @param   {WordShuffle_Models_Instructions_Page[]} scope.pages     - array of pages to display
             * @param   {string}                    scope.pageBody  - current page to display
             * @param   {int}                       scope.dwell     - milliseconds to dwell on each page before switching to next one
             * @param   {Object}    element         - the DOM element attached to directive
             */
            function link(scope, element) {
                var self = scope;
                // wait for backend to load pages
                var _intervalId = $interval(_wait, 100);
                var _maxHt = 0;

                /*************************************************
                 * PROPERTY DECLARATIONS with GETTERS and SETTERS
                 *************************************************/
                /**
                 * Indexes the currently active page for display
                 * @type {number}
                 */
                self.index = 0;

                /********************
                 * PRIVATE FUNCTIONS
                 ********************/
                function _wait(){
                    if(typeof self.pages === 'undefined'){
                        // do nothing until pages have content
                    }
                    else if(typeof self.pages[self.index] === 'undefined') {
                        // do nothing until pages have content
                    }
                    else{
                        // change interval callback to update slide page, reflect directive dwell time
                        $interval.cancel(_intervalId);
                        _intervalId = $interval(_updateSlide, self.dwell);
                    }
                }

                function _updateSlide() {
                    //set the container height as dictated by the longest page in order to stop page from bouncing
                    if(element.height() > _maxHt){
                        _maxHt = element.height();
                        element.parent().css('height',element.css('height'));
                    }

                    self.index++;
                    if(self.index >= self.pages.length){
                        self.index = 0;
                    }
                }

                $rootScope.$on('slideShowStop', function (event, args) {
                    scope.stop = args.stop;
                    $interval.cancel(_intervalId);
                    if (scope.stop == false) {
                        _intervalId = $interval(_updateSlide, self.dwell);
                    }
                });

                $rootScope.$on('slideShowPageSelected', function (event, args) {
                    self.index = args.index - 1;
                });
                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });
            }
            Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);
            return self;
        }

        return new wordshuffleDirectivesInstructionsSlideShow;
    }
    wordshuffleDirectivesInstructionsSlideShowProvider.$inject = ['App_Common_Models_Tools_Logger','$rootScope','$interval'];

    angular.module('App').directive('wordshuffleDirectivesInstructionsSlideShow', wordshuffleDirectivesInstructionsSlideShowProvider);
})();

