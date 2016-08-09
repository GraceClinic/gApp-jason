(function () {

    /**
     * @param {App_Common_Models_Tools_Logger} Logger
     * @param $interval
     * @returns {wordshuffleDirectivesInstructionsSlideShow}
     */
    function wordshuffleDirectivesInstructionsSlideShowProvider(Logger, $interval, $timeout) {

        /**
         * @class wordshuffleDirectivesInstructionsSlideShow
         * @returns {wordshuffleDirectivesInstructionsSlideShow}
         */
        function wordshuffleDirectivesInstructionsSlideShow() {
            var self = this;
            var _oldDwell;

            Logger.entry('START ' + self.constructor.name + '.construct()',self.constructor.name);

            self.restrict = 'E';    // element name type directive
            self.templateUrl = '/app/modules/wordshuffle/directives/instructions/SlideShow.drv.html';
            self.scope = {
                pages:      '=',        // array of Page models
                dwell:      '='       // milli-seconds to show each page
            };
            self.link = link;
            self.controller = controller;

            /**
             * Controller for the SlideShow directive
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
                // if (self.stop == undefined) {
                //     console.log("inside if-block");
                //     self.stop = false;
                // }


                /*************************************************
                 * PROPERTY DECLARATIONS with GETTERS and SETTERS
                 *************************************************/
                /**
                 * Indexes the currently active page for display
                 * @type {number}
                 */
                self.index = 0;
                _oldDwell = self.dwell;

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

                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                element.on('$destroy', function() {
                    $interval.cancel(_intervalId);
                });

                // TODO: is there any cleanup activity?
                scope.$watch("stop", function () {
                    //console.log("watch called");
                    if (scope.stop) {
                        $interval.cancel(_intervalId);
                    }
                    // wait for promise to be rejected before establishing a new one
                    // TODO:  determine is another mechanism to check promise aside from accessing private $$state
                    else if(_intervalId.$$state.status === 2){
                        _intervalId = $interval(_updateSlide, self.dwell);
                    }
                })
            }

            function controller($scope) {

                /**
                 * @property    stop
                 * controls play of the slideshow
                 *
                 * @type    {boolean}
                 * @public
                 **/
                Object.defineProperty($scope,'stop',{get: getStop, set: setStop, enumerable:true});
                var _stop;
                function getStop(){
                    return _stop;
                }
                function setStop(value){
                    _stop = value;
                }

                $scope.getValue = function(){
                    if($scope.stop) {
                        return "PLAY"
                    }else{
                        return "STOP"
                    }
                };

                // $timeout(
                //     function _logStopFlag() {
                //         $scope.stop = true;
                //         console.log("value of stop", $scope.stop);
                //     },
                //     10000);
            }

            return self;
        }
        return new wordshuffleDirectivesInstructionsSlideShow;
    }
    wordshuffleDirectivesInstructionsSlideShowProvider.$inject = ['App_Common_Models_Tools_Logger','$interval', '$timeout'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesInstructionsSlideShow', wordshuffleDirectivesInstructionsSlideShowProvider);
})();