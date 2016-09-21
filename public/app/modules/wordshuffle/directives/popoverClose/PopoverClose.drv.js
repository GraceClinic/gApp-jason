// what does this directive do and how you achieve the desired!
// 1. what does it do :
//      In ui-bootstrap 0.13.0, remove popover on clicking any where else in document or clicking on specific buttons on popover template
// 2. how to achieve this:
//      ->add a class "close-popover" on the elements on which you want the popover to disaapear
//      ->use popoverToggle directive in you html to toggle display (bower install popoverToggle --save)
//      ->you should define methods close-pop-func and open-pop-func, where you set the toggling property to false/true
(function () {

    /**
     * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
     * @param  {$timeout}   $timeout    -setTimeout with $apply
     * @param   {$parse}    $parse  -evaluate an expression
     * @returns {wordshuffleDirectivesPopoverClosePopoverClose}
     */
    function wordshuffleDirectivesPopoverClosePopoverCloseProvider(Logger, $timeout, $parse) {

        /**
         * @class wordshuffleDirectivesPopoverClosePopoverClose
         * @returns {wordshuffleDirectivesPopoverClosePopoverClose}
         */
        function wordshuffleDirectivesPopoverClosePopoverClose() {
            Logger.entry('START ' + self.constructor.name + '.construct()', self.constructor.name);


            this.restrict = 'A';

            this.link = link; // this.link is the intrinsic controller for a directive

            /**
             * Provides for logic that controls aspects of the directive based on construction and / or events
             *
             * @param   {Object}    scope           - reference to angular directive scope
             * @param   {}  scope.<PROP>            -
             * @param   {Object}    element         - the DOM element attached to directive
             * @param   {Object}    attributes      - the actual attributes values passed within the directive DOM element
             */
            console.log("this is called");
            function link(scope, element, attributes) {
                // proxy scope to self for consistency and use of templates for defining methods
                var self = scope;
                /**
                 * @method   clickHandler
                 * this should handle configuration button clicks
                 *
                 * @public                      - todo: scope as public or protected, prefix name with "_" for protected                  
                 * @param    {}                 - todo: document each parameter
                 * @return   {}
                 */
                self.clickHandler = function(event){
                    var classNames = [];
                    var classList = event.target.className.split(" ");
                    for (var key in classList) {
                        if (classList.hasOwnProperty(key)) {
                            classNames.push(classList[key]);
                        }
                    }
                    if (event.target.id == "popover-trigger-button") {
                        scope.$apply(function () {
                            $parse(attributes.openPopFunc)(scope);
                        });
                    }
                    else if($(event.target).closest(element).length === 0 || classNames.indexOf("close-popover") > -1 ) {
                        scope.$apply(function () {
                            $parse(attributes.closePopFunc)(scope);
                        });
                    }
                };
                $(document).on("click", self.clickHandler);
                $(".close-popover").on("click", self.clickHandler);
                scope.$on("$destroy", function () {
                    $(document).off("click", self.clickHandler);
                });
            }

            Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);

            return this;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new wordshuffleDirectivesPopoverClosePopoverClose;
    }

    wordshuffleDirectivesPopoverClosePopoverCloseProvider.$inject = ['App_Common_Models_Tools_Logger', '$timeout', '$parse'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesPopoverClosePopoverClose', wordshuffleDirectivesPopoverClosePopoverCloseProvider);
})();