(function () {
    /**
     * Services the general look/feel of the WordShuffle module
     *
     * @param    {App_Common_Models_SysMan}  SysMan  - reference to the SysMan singleton
     * @this        WordShuffle_Controllers_Layout
     */
    function WordShuffle_Controllers_Layout(SysMan,Game,$modal) {
        var self = this;		// required alias to address resolution to immediate scope

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

        /**
         * @method   open
         * invoke modal to configure game details
         * @public
         * @param    {}
         * @return   {}
         */
        self.open = function(){
            if(Game.state == Game.IN_PROGRESS) {
                $(".modal-backdrop").hide();
                $(".modal.fade").hide();
            }
            else {
                setTimeout(
                    function () {
                        $modal.open({
                            templateUrl: 'app/modules/wordshuffle/views/play/configModal.html',
                            size: 'md'
                        })
                    }, 250);
            }
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
        'WordShuffle_Models_Game',
        '$modal'
    ];

    angular.module('App_WordShuffle').controller('WordShuffle_Controllers_Layout', WordShuffle_Controllers_Layout);
})();
