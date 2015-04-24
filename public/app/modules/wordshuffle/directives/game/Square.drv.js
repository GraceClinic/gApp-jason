(function () {

    //todo:  reference newly injected dependencies as needed
    function WordshuffleDirectivesGameSquareProvider(Logger,$interval) {

        var _squareHeight = 0;

        function WordshuffleDirectivesGameSquare() {
            Logger.entry('Constructor START','WordShuffle_Directives_Game_Square',Logger.INFO);
            var self = this;

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            self.restrict = 'E';    // match on element name
            self.templateUrl = '/app/modules/wordshuffle/directives/game/Square.drv.html';
            self.scope = {
                square:     '='
            };
            self.link = controller;

            /**
             * Provides for logic that controls aspects of the directive based on construction and / or events
             *
             * @param   {Object}    scope           - reference to angular directive scope
             * @param   {WordShuffle_Models_Game_Square}    scope.square    - game square
             * @param   {Object}    element         - the DOM element attached to directive
             */
            function controller(scope, element) {
                scope.square.idTag = 'wordshuffle-models-game-square-' + scope.square.row + '-' + scope.square.col;

                var _intervalId = $interval(_wait, 100);

                function _wait(){
                    if(scope.square.DOM !== null){
                        var _width = scope.square.DOM.width();
                        // wait until element width is defined and other elements have populated and consumed row width
                        if(typeof _width === 'undefined'){
                            // do nothing until width is defined
                        }else{
                            // as soon width defined, adjust height
                            _updateHeight();

                            // change interval callback to update slide page, reflect directive dwell time
                            $interval.cancel(_intervalId);
                        }
                    }
                }

                // adjust height on any resize of window
                angular.element(window).on('resize',_updateHeight);

                element.bind('click', function(){
                    scope.square.isSelected = !scope.square.isSelected;

                    // need to use scope.$apply because the watched event is outside of angular's scope; hence it
                    // must be instructed to apply changes to the DOM
                    scope.$apply(scope.square.callOnClick(scope.square));
                });

                element.on('mouseenter',function(){
                    if(scope.square.DOM !== null){
                        if(!scope.square.isSelected){
                            scope.square.DOM.css('border-color','#2328ff');
                        }
                        scope.square.DOM.css('border-width','4px');
                    }
                });

                element.on('mouseleave',function(){
                    if(scope.square.DOM !== null){
                        if(!scope.square.isSelected){
                            scope.square.DOM.css('border-color','#181b42');
                        }
                        scope.square.DOM.css('border-width','2px');
                    }
                });

                function _updateHeight() {
                    if(scope.square.DOM !== null){
                        _squareHeight = scope.square.DOM.width();
                        // todo:  define logic
                        if(typeof _squareHeight === 'undefined'){
                            // do nothing
                        }else{
                            scope.square.DOM.height(_squareHeight);

                            switch(true){
                                case _squareHeight > 80:
                                    scope.square.DOM.css('font-size','72px');
                                    break;
                                case _squareHeight > 70:
                                    scope.square.DOM.css('font-size','64px');
                                    break;
                                case _squareHeight > 60:
                                    scope.square.DOM.css('font-size','48px');
                                    break;
                                case _squareHeight > 50:
                                    scope.square.DOM.css('font-size','42px');
                                    break;
                                case _squareHeight > 40:
                                    scope.square.DOM.css('font-size','32px');
                                    break;
                                case _squareHeight > 30:
                                    scope.square.DOM.css('font-size','24px');
                                    break;
                                case _squareHeight > 10:
                                    scope.square.DOM.css('font-size','14px');
                                    break;
                                default:
                                    scope.square.DOM.css('font-size','8px');
                            }
                        }
                    }

                }

            }

            return self;
        }

        return new WordshuffleDirectivesGameSquare;
    }

    // todo:  inject new dependencies into directive as needed
    WordshuffleDirectivesGameSquareProvider.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesGameSquare', WordshuffleDirectivesGameSquareProvider);
})();