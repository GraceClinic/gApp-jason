
(function(){
    function PlayController(Controller,$location){

        function WordShuffle_Controllers_Play(){
            var self = this;

            // private variables
            var _Note = null;

            // define any public properties
            Object.defineProperty(self,"Note",{
                get: function(){
                    if(_Note == null){
                        _Note = 'nothing';
                    }
                    return _Note;
                },
                set: function(){
                    console.log('WelcomeCtrl.Note.set not allowed!');
                }
            });
            // define all of the action methods
            self.indexAction = function(){
                console.log('Play.index action');
            };


            console.log('PlayCtrl.construct START');

            Controller.call(self);

            console.log('PlayCtrl.construct END');
        }

        // inherit prototype functions from superclass Controller
        WordShuffle_Controllers_Play.prototype = Object.create(Controller.prototype);
        // Correct constructor which points to Controller
        WordShuffle_Controllers_Play.prototype.constructor = WordShuffle_Controllers_Play;

        return new WordShuffle_Controllers_Play;
    }
    // inject dependencies
    PlayController.$inject = ['App_Common_Abstracts_Controller','$location'];
    
    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Play',PlayController);
})();

