(function () {

    /**
     * @param {object}  $document   - reference to AngularJS $document object
     * @returns {appCommonDirectivesUtilitiesDraggable}
     */
    function appCommonDirectivesUtilitiesDraggableProvider($document) {

        /**
         * @class appCommonDirectivesUtilitiesDraggable
         * @returns {appCommonDirectivesUtilitiesDraggable}
         */
        function appCommonDirectivesUtilitiesDraggable() {

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            this.restrict = 'A';
            this.link = controller;

            /**
             *
             * @param   {Object}    scope           - reference to angular directive scope for Banner
             * @param   {Object}    element         - the DOM element attached to directive
             * @param   {Object}    attr            - the actual attributes values passed within the directive DOM element
             */
            function controller(scope, element, attr) {
                var _startX = 0, _startY = 0, _x = 0, _y = 0;

                /********************
                 * PRIVATE FUNCTIONS
                 ********************/
                function _mouseMove(event) {
                    _y = event.pageY - _startY;
                    _x = event.pageX - _startX;
                    element.css({
                        top: _y + 'px',
                        left:  _x + 'px'
                    });
                }

                function _mouseUp() {
                    $document.off('mousemove', _mouseMove);
                    $document.off('mouseup', _mouseUp);
                }

                /*******************
                 * CONSTRUCTOR LOGIC
                 *******************/
                element.css({
                    position: 'relative',
                    cursor: 'pointer'
                });

                element.on('mousedown', function(event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    _startX = event.pageX - _x;
                    _startY = event.pageY - _y;
                    $document.on('mousemove', _mouseMove);
                    $document.on('mouseup', _mouseUp);
                });

            }

            return this;
        }

        //noinspection JSPotentiallyInvalidConstructorUsage
        return new appCommonDirectivesUtilitiesDraggable;
    }

    appCommonDirectivesUtilitiesDraggableProvider.$inject = ['$document'];

    angular.module('App').directive('appCommonDirectivesUtilitiesDraggable', appCommonDirectivesUtilitiesDraggableProvider);
})();