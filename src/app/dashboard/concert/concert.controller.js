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

        vm.getThumbForJamJar = function(videoId) {
          var video = _.find(vm.concert.videos, {id: videoId});
          return video.thumb_src[256];
        }

        ConcertService.getConcertById(vm.concert_id, function(err, res) {
            vm.concert = res;

            _.each(vm.concert.graph, function(jamjar){
                var video_ids = _.keys(jamjar.adjacencies);

                jamjar.thumbnails = _.map(video_ids, function(videoId){
                    var video = _.find(vm.concert.videos, {id:parseInt(videoId)});
                    if (video) {
                        return video.thumb_src;
                    }
                });
            });
        });
    }
})();
