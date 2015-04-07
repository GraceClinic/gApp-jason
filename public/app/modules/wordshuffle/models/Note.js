/**
 * File: Note
 * User: jderouen
 * Date: 1/11/15
 * Time: 9:30 AM
 * To change this template use File | Settings | File Templates.
 */
(function(){

    function Note_Factory(Model,$http){
        /**
         * Note Model
         *
         * @class       Note
         * @property    {string}    items       - JSON string representing items
         * @returns     {Note}
         */
        function Note(){
            // Class initialization
            var self = this;

            var _URL = '/WordShuffle/Player';

            // class properties
            var _p = {
                items: null    // note items
            };

            // private variables
            // none

            // define setters and getters
            Object.defineProperty(self,"items",{
                get: function() {
                    return _p.items;
                },
                set: function(x) {
                    _p.items = x;
                }
            });

            // start constructor logic
            console.log('Note.construct START');
            // call superclass and data array
            Model.call(self);

            // public methods
            self.remove = function($id){
                $http({
                    url:'/WordShuffle/Player',
                    method: "DELETE",
                    data: {'id':$id}
                })
                    .then(
                    function(response) {
                        console.log('Delete note item, response = ',response);
                    },
                    function(errResponse) {
                        console.error('Error while deleting note');
                    }
                );
            };
            self.save = function($data){
                console.log('Note.save START');
                var req = {
                    url: _URL,
                    method: "PUT",
                    data: $data
                };

                if(typeof $data.id == 'undefined'){
                    req.method = "POST";
                }else{
                    req.url = _URL + '/id/' + $data.id;
                }

                $http(req).then(
                    function(rsp){
                        console.log(req.method,' note item, response = ',rsp);
                    },
                    function(errRsp){
                        console.log(req.method,' note item error, response = ',errRsp);
                    }
                )
                console.log('Note.save END');

            }
            self.get = function($id){
                $http({
                    url:'/WordShuffle/Player/id/'+$id,
                    method: "GET"
                })
                    .then(
                    function(response) {
                        console.log('Get note item, response = ',response);
                        self.items = response.data;
                    },
                    function(errResponse) {
                        console.error('Error while fetching notes');
                    }
                );
            };
            // private methods
            // none

            self.get(1);

            console.log('Note.construct END');

            return self;
        }

        // setup the inheritance chain
        Note.prototype = Object.create(Model.prototype);
        Note.prototype.constructor = Note;

        // singleton instance
        return new Note;
    }

    Note_Factory.$inject = ['App_Common_Abstracts_Model','$http'];

    angular.module('App_WordShuffle').factory('WordShuffle.Note',Note_Factory);
})();

