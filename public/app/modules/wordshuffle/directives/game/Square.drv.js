(function () {

    //todo:  reference newly injected dependencies as needed
    function WordshuffleDirectivesGameSquareProvider(Logger,$interval) {

        var _squareHeight = 0;

        function WordshuffleDirectivesGameSquare() {
            Logger.entry('Constructor START','WordShuffle_Directives_Game_Square',Logger.INFO);
            //var self = this;

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            this.restrict = 'E';    // match on element name
            this.templateUrl = '/app/modules/wordshuffle/directives/game/Square.drv.html';
            this.scope = {
                square:     '='
            };
            this.link = controller;

            /**
             * Provides for logic that controls aspects of the directive based on construction and / or events
             *
             * @param   {object}    scope           - reference to angular directive scope
             * @param   {WordShuffle_Models_Game_Square}    scope.square    - game square
             * @param   {object}    element         - the DOM element attached to directive
             */
            function controller(scope, element) {
                var self = scope;

                self.square.idTag = 'wordshuffle-models-game-square-' + self.square.row + '-' + self.square.col;

                var _intervalId = $interval(_wait, 100);

                function _wait(){
                    if(self.square.DOM !== null){
                        var _width = self.square.DOM.width();
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
                    self.square.isSelected = !self.square.isSelected;

                    // need to use scope.$apply because the watched event is outside of angular's scope; hence it
                    // must be instructed to apply changes to the DOM
                    scope.$apply(self.square.callOnClick(self.square));
                });

                element.on('mouseenter',function(){
                    if(self.square.DOM !== null){
                        if(!self.square.isSelected){
                            self.square.DOM.css('border-color','#2328ff');
                        }
                        self.square.DOM.css('border-width','4px');
                    }
                });

                element.on('mouseleave',function(){
                    if(self.square.DOM !== null){
                        if(!self.square.isSelected){
                            self.square.DOM.css('border-color','#181b42');
                        }
                        self.square.DOM.css('border-width','2px');
                    }
                });

                function _updateHeight() {
                    if(self.square.DOM !== null){
                        _squareHeight = self.square.DOM.width();
                        // todo:  define logic
                        if(typeof _squareHeight === 'undefined'){
                            // do nothing
                        }else{
                            self.square.DOM.height(_squareHeight);

                            switch(true){
                                case _squareHeight > 80:
                                    self.square.DOM.css('font-size','72px');
                                    break;
                                case _squareHeight > 70:
                                    self.square.DOM.css('font-size','64px');
                                    break;
                                case _squareHeight > 60:
                                    self.square.DOM.css('font-size','48px');
                                    break;
                                case _squareHeight > 50:
                                    self.square.DOM.css('font-size','42px');
                                    break;
                                case _squareHeight > 40:
                                    self.square.DOM.css('font-size','32px');
                                    break;
                                case _squareHeight > 30:
                                    self.square.DOM.css('font-size','24px');
                                    break;
                                case _squareHeight > 10:
                                    self.square.DOM.css('font-size','14px');
                                    break;
                                default:
                                    self.square.DOM.css('font-size','8px');
                            }
                        }
                    }

                }

            }

            return this;
        }

        return new WordshuffleDirectivesGameSquare;
    }

    // todo:  inject new dependencies into directive as needed
    WordshuffleDirectivesGameSquareProvider.$inject = ['App_Common_Models_Tools_Logger','$interval'];

    angular.module('App_WordShuffle').directive('wordshuffleDirectivesGameSquare', WordshuffleDirectivesGameSquareProvider);
})();