(function () {

    //todo:  reference newly injected dependencies as needed

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @returns {wordshuffleDirectivesInstructionsSlideShowOutline}
     */
    function wordshuffleDirectivesInstructionsSlideShowOutlineProvider(Logger,$rootScope,$Instructions) {

        /**
         * @class wordshuffleDirectivesInstructionsSlideShowOutline
         * @returns {wordshuffleDirectivesInstructionsSlideShowOutline}
         */
        function wordshuffleDirectivesInstructionsSlideShowOutline() {
            var self = this;
            Logger.entry('START ' + self.constructor.name + '.construct()', self.constructor.name);

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the returns from the directive as expected by AngularJS
            this.restrict = 'E';
            this.templateUrl = '/app/modules/wordshuffle/directives/instructions/SlideShowOutline.drv.html';
            this.scope = {
                title   : '=',
                length  : '='
            };
            this.controllerAs = "SlideShowOutlineCtrl";
            this.bindToController = true;
            this.controller = controller; // this.link is the intrinsic controller for a directive

            // todo: define each property created on the scope object
            /**
             * Provides for logic that controls aspects of the directive based on construction and / or events
             *
             */
            function controller() {
                // proxy scope to self for consistency and use of templates for defining methods
                var self = this;    //$scope;

                //$rootScope.$emit('slideShowStateListener', {stop: self.stop});
                /*************************************************
                 * PROPERTY DECLARATIONS with GETTERS and SETTERS
                 *************************************************/
                // todo: use ng_prop to create complete properties, otherwise create simply, uncontrolled properties off of self

                /**
                 * @property    stop
                 * stop flag to operate on slide show
                 *
                 * @type    {boolean}
                 * @public
                 **/
                Object.defineProperty(self,'stop',{get: getStop, set: setStop, enumerable:true});
                var _stop = "Pause";
                function getStop(){
                    return _stop;
                }
                function setStop(value){
                    _stop = value;
                }
                
                /**
                 * @property    pageNum
                 * array of page numbers required to generate the links for each page
                 *
                 * @type    {array}
                 * @public
                 **/
                Object.defineProperty(self,'pageNum',{get: getPageNum, set: setPageNum, enumerable:true});
                var _pageNum  = [];
                function getPageNum(){
                    _pageNum  = [];
                    if(self.length > 0) {
                        for (i = 0; i < self.length; i++) {
                            _pageNum.push(i + 1);
                        }
                    }
                    console.log("self.length ",self.length);
                    return _pageNum;
                }
                function setPageNum(){
                    Logger.entry('Set not allowed here', self.constructor.property);
                }

                /**
                 * @property    selectedPageNum
                 * determines the page number clicked
                 *
                 * @type    {int}
                 * @public
                 **/
                Object.defineProperty(self,'selectedPageNum',{get: getSelectedPageNum, set: setSelectedPageNum, enumerable:true});
                var _selectedPageNum;
                function getSelectedPageNum(){
                    return _selectedPageNum;
                }
                function setSelectedPageNum(value){
                    _selectedPageNum = value;
                }

                /**
                 * @property    collapsed
                 * toggle flag used for expand and collapse of the container
                 *
                 * @type    {boolean}
                 * @public
                 **/
                Object.defineProperty(self,'collapsed',{get: getCollapsed, set: setCollapsed, enumerable:true});
                var _collapsed =false;
                function getCollapsed(){
                    return _collapsed;
                }
                function setCollapsed(value){
                    _collapsed = value;
                }

                /**
                 * @property    imgToggle
                 * to display expand collapse image source
                 *
                 * @type    {string}
                 * @public
                 **/
                Object.defineProperty(self,'imgToggle',{get: getImgToggle, set: setImgToggle, enumerable:true});
                var _imgToggle = "app/assets/wordshuffle/expand.png";
                function getImgToggle(){
                    return _imgToggle;
                }
                function setImgToggle(value){
                    _imgToggle = value;
                }


                /****************************
                 * PUBLIC METHODS DEFINITION
                 ****************************/
                // todo:  use "ng_method" live template to insert individual controller methods (accessible through the controller's associated view)
                /**
                 * @method   selectedPage
                 * display the page selected and stop the slide show
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected
                 * @param    {index}                 - todo: document each parameter
                 * @return   {}
                 */
                self.selectedPage = function(index){
                    console.log("Index is ",index);
                    $rootScope.$emit('slideShowStop', {stop: true});
                    $rootScope.$emit('slideShowPageSelected', {index: index});
                    self.selectedPageNum = index;
                    self.stop = "Play";
                };

                /**
                 * @method   isSelected
                 * return boolean value after validating the page selected.
                 * used for highlighting the selected page link
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected
                 * @param    {index}                 - todo: document each parameter
                 * @return   {boolean}
                 */
                self.isSelected = function(index){
                  return self.selectedPageNum === index;
                };

                /**
                 * @method   toggleSlideShow
                 * Toggle the slide show
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected                  
                 * @param    {}                 - todo: document each parameter
                 * @return   {}
                 */
                self.toggleSlideShow = function(){
                    if(self.stop == "Pause") {
                        self.stop = "Play";
                        $rootScope.$emit('slideShowStop', {stop: true});   //slideShowStateEvent
                    }
                    else {
                        self.stop = "Pause";
                        $rootScope.$emit('slideShowStop', {stop: false});
                    }
                    self.selectedPageNum = -1;
                };
                
                /**
                 * @method   toggleOutline
                 * toggles between expand and collapse
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected                  
                 * @param    {}                 - todo: document each parameter
                 * @return   {}
                 */
                self.toggleOutline = function(){
                    self.collapsed = !self.collapsed;
                    if(self.imgToggle == "app/assets/wordshuffle/expand.png")
                        self.imgToggle = "app/assets/wordshuffle/collapse.png";
                    else
                        self.imgToggle = "app/assets/wordshuffle/expand.png";
                };
                

                /********************
                 * PRIVATE FUNCTIONS
                 ********************/
                // todo:  use "ng_func" live template to insert private functions 

                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                // todo:  use element.on('destroy',...) or scope.$on('destroy,...) to clean up after registered listeners

            }

            Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);

            return self;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new wordshuffleDirectivesInstructionsSlideShowOutline;
    }

    // todo:  inject new dependencies into directive as needed
    wordshuffleDirectivesInstructionsSlideShowOutlineProvider.$inject = ['App_Common_Models_Tools_Logger','$rootScope','WordShuffle_Models_Instructions'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesInstructionsSlideShowOutline', wordshuffleDirectivesInstructionsSlideShowOutlineProvider);
})();