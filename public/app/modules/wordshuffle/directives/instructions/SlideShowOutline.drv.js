(function () {

    //todo:  reference newly injected dependencies as needed

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
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
            this.restrict = 'A';
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

            function controller($scope){
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
                    console.log("stop working");
                    _stop = value;
                    if(_stop){
                        this.next = "PLAY";
                    }else{
                        this.next = "STOP";
                    }
                    if (!this.individualPageInstruction) {
                        $rootScope.$emit("slideShow:stopPlay", {stop: value});
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
                 * @property    individualPageInstruction
                 * set a flag of true or false, which can be checked for firing emit inside setStop
                 *
                 * @type    {boolean}
                 * @public
                 **/

                if (typeof self.individualPageInstruction === "undefined") {
                    Object.defineProperty(self,'individualPageInstruction',{get: getIndividualPageInstruction, set: setIndividualPageInstruction, enumerable:true});
                    var _individualPageInstruction = false;
                    function getIndividualPageInstruction(){
                        return _individualPageInstruction;
                    }
                    function setIndividualPageInstruction(value){
                        _individualPageInstruction = value;
                    }
                }


                /**
                 * @method   displayInstruction
                 * stop slide show and display the clicked instruction
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected
                 * @param    {}                 - todo: document each parameter
                 * @return   {void}
                 */
                this.displayInstruction = function($event){
                    // todo: code method
                    //it is assumed that page numbers are seperated by a space and it comes at the last
                    var pageClicked = $event.target.textContent.split (" ");
                    var nameLength = $event.target.textContent.split(" ").length;
                    $rootScope.$emit("slideShow:stopPlay", {stop: true, index: pageClicked[nameLength - 1]});
                    this.individualPageInstruction = true;
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
                    console.log("stopPlay called");
                    this.individualPageInstruction = false;
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