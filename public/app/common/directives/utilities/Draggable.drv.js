(function () {

    //todo:  reference newly injected dependencies as needed
    function DraggableDirective($document) {

        function Draggable() {
            var self = this;

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            self.restrict = 'A';
            self.link = controller;

            /**
             *
             * @param   {Object}    scope           - reference to angular directive scope for Banner
             * @param   {Object}    element         - the DOM element attached to directive
             * @param   {Object}    attr            - the actual attributes values passed within the directive DOM element
             */
            function controller(scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0;

                element.css({
                    position: 'relative',
                    cursor: 'pointer'
                });

                element.on('mousedown', function(event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mouseMove);
                    $document.on('mouseup', mouseUp);
                });

                function mouseMove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    element.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }

                function mouseUp() {
                    $document.off('mousemove', mouseMove);
                    $document.off('mouseup', mouseUp);
                }
            }

            return self;
        }

        return new Draggable;
    }

    // todo:  inject new dependencies into directive as needed
    DraggableDirective.$inject = ['$document'];

    angular.module('App').directive('appCommonDirectivesUtilitiesDraggable', DraggableDirective);
})();