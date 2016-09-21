(function () {
    /**
     * Services the general look/feel of the WordShuffle module
     *
     * @param    {App_Common_Models_SysMan}  SysMan  - reference to the SysMan singleton
     * @this        WordShuffle_Controllers_Layout
     */
    function WordShuffle_Controllers_Layout(SysMan, Player, Game, $state) {
        var self = this;		// required alias to address resolution to immediate scope
        
        /**
         * @property    Player
         * this will give access to the player model - required for a popover
         *
         * @type    {WordShuffle_Models_Player}
         * @public
         **/
        Object.defineProperty(self,'Player',{get: getPlayer, set: setPlayer, enumerable:true});
        function getPlayer(){
            return Player;
        }
        function setPlayer(value){
            self.SysMan.Logger.entry('Player.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }

        /**
         * @property    Game
         * access Game, set newGame to be true on click of popover
         *
         * @type    {WordShuffle_Models_Game}
         * @public
         **/
        Object.defineProperty(self,'Game',{get: getGame, set: setGame, enumerable:true});
        var _Game;
        function getGame(){
            return Game;
        }
        function setGame(value){
            self.SysMan.Logger.entry('Game.set() not allowed!',self.constructor.name,self.SysMan.Logger.TYPE.ERROR,self.SysMan.Logger.ERRNO.CTRL_ERROR);
        }
        
        /**
         * @property    popUp
         * set this to true/false, allowing the popover to functionally appear and disappear
         *
         * @type    {boolean}
         * @public
         **/
        Object.defineProperty(self,'popUp',{get: getPopUp, set: setPopUp, enumerable:true});
        var _popUp = false;
        function getPopUp(){
            return _popUp;
        }
        function setPopUp(value){
            _popUp = value;
        }
        

        /**
         * @method   isActive
         * Identifies if controller parameter is active
         *
         * @public
         * @param    {string}  ctrl               - controller string
         * @return   {boolean}
         */
        self.isActive = function(ctrl){
            return SysMan.state.controller == ctrl;
        };

        /*******************
         * CONSTRUCTOR LOGIC
         *******************/
        SysMan.Logger.entry('START ' + self.constructor.name + '.construct()', self.constructor.name);

        SysMan.Logger.entry('END ' + self.constructor.name + '.construct()', self.constructor.name);
    }

    // Explicitly define the constructor
    WordShuffle_Controllers_Layout.prototype.constructor = WordShuffle_Controllers_Layout;

    WordShuffle_Controllers_Layout.$inject = [
        'App_Common_Models_SysMan',
        'WordShuffle_Models_Player',
        'WordShuffle_Models_Game',
        '$state'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Layout', WordShuffle_Controllers_Layout);
})();
