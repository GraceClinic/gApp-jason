(function () {

    /**
     * @param {App_Common_Models_Tools_Logger} Logger
     * @param $interval
     * @returns {wordshuffleDirectivesInstructionsSlideShow}
     */
    function wordshuffleDirectivesInstructionsSlideShowProvider(Logger,$interval) {

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
                pages:      '=',        // array of Page models
                dwell:      '='         // milli-seconds to show each page
            };
            self.link = controller;

            /**
             * Controller for the SlideShow directive
             *
             * @param   {Object}                    scope           - reference to angular directive scope
             * @param   {WordShuffle_Models_Instructions_Page[]} scope.pages     - array of pages to display
             * @param   {string}                    scope.pageBody  - current page to display
             * @param   {int}                       scope.dwell     - milliseconds to dwell on each page before switching to next one
             * @param   {Object}    element         - the DOM element attached to directive
             */
            function controller(scope, element) {
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
                        // as soon as pages load from backend, display in directive
                        self.pageBody = self.pages[self.index].body;    // initialize page display to the first page

                        // change interval callback to update slide page, reflect directive dwell time
                        $interval.cancel(_intervalId);
                        _intervalId = $interval(_updateSlide, self.dwell);
                    }
                }

                function _updateSlide() {
                    self.index++;
                    if(self.index >= self.pages.length){
                        self.index = 0;
                    }

                    //set the container height as dictated by the longest page in order to stop page from bouncing
                    if(element.height() > _maxHt){
                        _maxHt = element.height();
                        element.parent().css('height',element.css('height'));
                    }

                }

                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });
            }

            return self;
        }

        return new wordshuffleDirectivesInstructionsSlideShow;
    }
    wordshuffleDirectivesInstructionsSlideShowProvider.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App').directive('wordshuffleDirectivesInstructionsSlideShow', wordshuffleDirectivesInstructionsSlideShowProvider);
})();