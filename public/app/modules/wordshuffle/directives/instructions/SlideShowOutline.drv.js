(function () {

    //todo:  reference newly injected dependencies as needed

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @params $rootScope   rootscope
     * @returns {wordshuffleDirectivesInstructionsSlideShowOutline}
     */
    function wordshuffleDirectivesInstructionsSlideShowOutlineProvider(Logger, $rootScope) {

        /**
         * @class wordshuffleDirectivesInstructionsSlideShowOutline
         * @returns {wordshuffleDirectivesInstructionsSlideShowOutline}
         */
        function wordshuffleDirectivesInstructionsSlideShowOutline() {
            Logger.entry('START ' + this.constructor.name + '.construct()', this.constructor.name);

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the returns from the directive as expected by AngularJS
            this.restrict = 'E';
            this.templateUrl = '/app/modules/wordshuffle/directives/instructions/SlideShowOutline.drv.html';
            this.scope = {
                title:      '@',
                pages:   '@'
            };
            // todo:  if this directive will be exposed for control by other directive, replace this.link with this.controller
            this.controller = controller; // this.link is the intrinsic controller for a directive
            this.bindToController = true;
            this.controllerAs = "SlideShowCtrl";
            this.transclude = false;

            function controller(){
                /**
                 * @property    stop
                 * state of slideshow
                 *
                 * @type    {boolean}
                 * @public
                 **/
                Object.defineProperty(this,'stop',{get: getStop, set: setStop, enumerable:true});
                var _stop = false;
                function getStop(){
                    return _stop;
                }
                function setStop(value){
                    _stop = value;
                    if(_stop){
                        this.next = "PLAY";
                    }else{
                        this.next = "STOP";
                    }
                }

                /**
                 * @property    next
                 * text toggling between PLAY and STOP depending on the stop state
                 *
                 * @type    {string}
                 * @public
                 **/
                Object.defineProperty(this,'next',{get: getNext, set: setNext, enumerable:true});
                var _next = "STOP";
                function getNext(){
                    return _next;
                }
                function setNext(value){
                    _next = value;
                }

                /**
                 * @property    isCollapsed
                 * toggles the collapsible instructions list
                 *
                 * @type    {boolean}
                 * @public
                 **/
                Object.defineProperty(this,'isCollapsed',{get: getIsCollapsed, set: setIsCollapsed, enumerable:true});
                var _isCollapsed = true;
                function getIsCollapsed(){
                    return _isCollapsed;
                }
                function setIsCollapsed(value){
                    _isCollapsed = value;
                }

                /**
                 * @property    selectedPageInstruction
                 * this is to highlight the selected page
                 *
                 * @type    {int}
                 * @public
                 **/
                Object.defineProperty(self,'selectedPageInstruction',{get: getSelectedPageInstruction, set: setSelectedPageInstruction, enumerable:true});
                var _selectedPageInstruction = -1;
                function getSelectedPageInstruction(){
                    return _selectedPageInstruction;
                }
                function setSelectedPageInstruction(value){
                    _selectedPageInstruction = value;
                }

                /**
                 * @property    numPages
                 * convert the integer value to array for ng-repeat
                 *
                 * @type    {array}
                 * @public
                 **/
                Object.defineProperty(this,'numPages',{get: getNumPages, set: setNumPages, enumerable:true});
                var _numPages = [];
                function getNumPages(){
                    var _pageArr = [];
                    for (var i = 1; i <= parseInt(this.pages); i ++) {
                        _pageArr.push(i);
                    }
                    return _pageArr;
                }
                function setNumPages(){
                    console.log("Not allowed");
                }

                /**
                 * @method   selectedPage
                 * stop slide show and display the clicked instruction
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected
                 * @param    {}                 - todo: document each parameter
                 * @return   {void}
                 */
                this.selectedPage = function($index){
                    this.selectedPageInstruction = $index;
                    $rootScope.$emit("slideShowPageSelected", {index: $index});
                    this.stop = true;
                };

                /**
                 * @method   stopPlay
                 * toggle stop button
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected
                 * @param    {}                 - todo: document each parameter
                 * @return   {void}
                 */
                this.stopPlay = function(){
                    // todo: code method
                    this.selectedPageInstruction = -1;
                    $rootScope.$emit("slideShowStop", {stop: !this.stop});
                    this.stop = !this.stop;
                };




            }

            Logger.entry('END ' + this.constructor.name + '.construct()', this.constructor.name);

            return this;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new wordshuffleDirectivesInstructionsSlideShowOutline;
    }

    // todo:  inject new dependencies into directive as needed
    wordshuffleDirectivesInstructionsSlideShowOutlineProvider.$inject = ['App_Common_Models_Tools_Logger', '$rootScope'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesInstructionsSlideShowOutline', wordshuffleDirectivesInstructionsSlideShowOutlineProvider);
})();