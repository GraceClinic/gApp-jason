(function () {

    //todo:  reference newly injected dependencies as needed
    function WordshuffleDirectivesGameSquareProvider(Logger,$interval) {

        var _width = '20%';
        var _heightNew = 0;
        var _heightOld = 0;
        var _squareCount = 0;
        var _processed = 0;
        var _lastProcessed = Date.now();

        function WordshuffleDirectivesGameSquare() {
            Logger.entry('Constructor START','WordShuffle_Directives_Game_Square',Logger.INFO);
            //var self = this;

            // todo:  define static variables, shared across any functions contained herein

            // todo:  define the angularjs expected returns from the directive
            this.restrict = 'E';    // match on element name
            this.templateUrl = '/app/modules/wordshuffle/directives/game/Square.drv.html';
            this.scope = {
                square:         '=',
                countPerRow:    '='
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

                var _countPerRow = parseInt(self.countPerRow);

                if(_countPerRow <= 0){
                    _countPerRow = 5;
                }

                // increment count of total number of squares
                _squareCount++;

                self.square.idTag = 'wordshuffle-models-game-square-' + self.square.row + '-' + self.square.col;

                var _intervalId = $interval(_wait, 100);

                function _wait(){
                    if(self.square.DOM !== null){
                        // wait until element width is defined and other elements have populated and consumed row width
                        if(typeof element.parent().width() === 'undefined'){
                            // do nothing until width is defined
                        }else{
                            // set square width to equal percentage based on number of squares per row
                            _width = parseInt(Math.floor(100/_countPerRow))+'%';
                            self.square.DOM.outerWidth(_width);
                            // only set height once for use by all squares
                            if(_heightNew == 0){
                                _heightNew = parseInt(Math.floor(self.square.DOM.outerWidth()));
                            }
                            self.square.DOM.outerHeight(_heightNew);

                            _updateFont(_heightNew);

                            console.log('Square ',self.square.idTag,' size = ',_heightNew);

                            // change interval callback to update slide page, reflect directive dwell time
                            $interval.cancel(_intervalId);
                        }
                    }
                }

                // adjust height on any resize of window
                angular.element(window).on('resize',_resizeSquare);

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

                function _resizeSquare(){
                    _processed++;
                    var _now = Date.now();
                    // if all squares processed or it has been some time since last processed,
                    // get new height and reset processed items so width can adjust again
                    if((_now - _lastProcessed) > 100 || _processed > _squareCount){
                        //var _height = parseInt(Math.floor(element.parent().width()/_countPerRow));
                        var _height = parseInt(Math.floor(self.square.DOM.outerWidth()));
                        if(_height > 0){
                            _heightOld = _heightNew;
                            _heightNew = _height;
                        }
                        _processed = 0;
                        _lastProcessed = _now;
                    }
                    // given resize event, set new height as appropriate
                    if(_heightNew !== _heightOld && _heightNew > 0){
                        self.square.DOM.outerHeight(_heightNew);
                        _updateFont(_heightNew);
                    }

                }

                function _updateFont(height) {
                    switch(true){
                        case height > 80:
                            self.square.DOM.css('font-size','72px');
                            break;
                        case height > 70:
                            self.square.DOM.css('font-size','64px');
                            break;
                        case height > 60:
                            self.square.DOM.css('font-size','48px');
                            break;
                        case height > 50:
                            self.square.DOM.css('font-size','42px');
                            break;
                        case height > 40:
                            self.square.DOM.css('font-size','32px');
                            break;
                        case height > 30:
                            self.square.DOM.css('font-size','24px');
                            break;
                        case height > 10:
                            self.square.DOM.css('font-size','14px');
                            break;
                        default:
                            self.square.DOM.css('font-size','8px');
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