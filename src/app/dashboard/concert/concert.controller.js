(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('ConcertController', ConcertController);

    /** @ngInject */
    function ConcertController(ConcertService, $state) {
        var vm = this;

        vm.concert_id = $state.params.id;
        vm.concert = {};
        vm.concert_graph = {};

        vm.getConcertArtists = function() {
          return _.map(vm.concert.artists, 'name').join(", ");
        }

        ConcertService.getConcertById(vm.concert_id, function(err, res) {
            if (err) {
                debugger
                return alert('error');
            }

            vm.concert = res;
        });

        ConcertService.getGraphById(vm.concert_id, function(err, res) {
            if (err) {
                debugger
                return alert('error');
            }

            vm.concert_graph = res;
            
            _.each(vm.concert_graph.graph, function(jamjar){
                var video_ids = _.keys(jamjar.adjacencies);
                
                jamjar.thumbnails = _.map(video_ids, function(videoId){
                    var video = _.find(vm.concert_graph.concert.videos, {id:parseInt(videoId)});
                    if(video){
                        return video.thumb_src;
                    }
                });
            });
            
            console.log(vm.concert_graph);
        });

        
    }
})();