(function () {

    //todo:  reference newly injected dependencies as needed

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @returns {wordshuffleDirectivesInstructionsSlideShowOutline}
     */
    function wordshuffleDirectivesInstructionsSlideShowOutlineProvider(Logger) {

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
            };
            // todo:  if this directive will be exposed for control by other directive, replace this.link with this.controller
            this.controller = controller; // this.link is the intrinsic controller for a directive
            this.bindToController = true;
            this.controllerAs = "SlideShowCtrl";
            this.transclude = true;

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
                var _next = "PLAY";
                function getNext(){
                    return _next;
                }
                function setNext(value){
                    _next = value;
                }


            }

            Logger.entry('END ' + this.constructor.name + '.construct()', this.constructor.name);

            return this;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new wordshuffleDirectivesInstructionsSlideShowOutline;
    }

    // todo:  inject new dependencies into directive as needed
    wordshuffleDirectivesInstructionsSlideShowOutlineProvider.$inject = ['App_Common_Models_Tools_Logger'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesInstructionsSlideShowOutline', wordshuffleDirectivesInstructionsSlideShowOutlineProvider);
})();