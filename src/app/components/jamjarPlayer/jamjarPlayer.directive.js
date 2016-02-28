(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlayer', jamjarPlayer);

  /** @ngInject */
  function jamjarPlayer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/jamjarPlayer/jamjarPlayer.html',
      controller: JamJarPlayerController,
      controllerAs: 'player',
      bindToController: true
    };

    /** @ngInject */
    function JamJarPlayerController(ConcertService, $sce, $stateParams, $state) {
      var vm = this;

      vm.$stateParams = $stateParams;

      vm.concert = {};
      vm.playable = {};
      vm.keyVideo = null;
      vm.rows = 1;
      vm.cols = 2;

      function urlAtOffset(src, offset_seconds) {
        if (offset_seconds) {
          src = src + '#' + Math.floor(offset_seconds);
        }

        return $sce.trustAsResourceUrl(src)
      }

      vm.getVideoById = function(video_id) {
        var video = _.find(vm.concert.concert.videos, function(video) {
          return video.id == video_id;
        });

        var graph = _.find(vm.concert.graph, function(graph) {
            return !!graph.adjacencies[video_id];
        });

        video.edges = graph.adjacencies[video_id];

        return video;
      };

      vm.getOffset = function(videoId) {
        return (vm.getKeyVideo().API.currentTime / 1000.0) - vm.getVideoById(videoId).edges[vm.keyVideo].offset;
      }

      vm.getKeyVideo = function() {
        return vm.playable[vm.keyVideo];
      }

      vm.addSource = function(videoId, offset) {
        var video = vm.getVideoById(videoId);

        if (!offset) {
          offset = 0;
        }

        video.config = {
          sources: [{src: urlAtOffset(video.web_src, offset), type: 'video/mp4'}],
          theme: "bower_components/videogular-themes-default/videogular.css",
        };

        // add it to the now-playing object -- this will create a videogular player for the video
        vm.playable[video.id] = video;
      };

      vm.getPlayableVideos = function() {
        var keyVideo = vm.getKeyVideo();

        var playableEdges = _.filter(keyVideo.edges, function(edge) {
          // require video length to be < requested offset position AND offset > 0
          var video = vm.getVideoById(edge.video);
          var offset = (vm.getKeyVideo().API.currentTime / 1000.0) - edge.offset;
          return offset > 0 && offset < video.length && edge.confidence >= 5;
        });

        return _.map(playableEdges, function(edge) {
          return vm.getVideoById(edge.video);
        });
      };

      vm.onUpdateSource = function(src, videoId) {
        if (videoId != vm.keyVideo) {
          var offset = vm.getOffset(videoId);
          vm.playable[videoId].API.seekTime(offset);
        }
      },

      vm.onUpdateTime = function() {
        var videos = vm.getPlayableVideos();
        _.each(videos, function(video) {
          if (vm.playable[video.id]) {
            // already in playable -- skip it
            return;
          } else {
            // not in playable -- add it
            vm.addSource(video.id, 0);
          }
        });
      };

      vm.onComplete = function() {
        //vm.setValidConnections();
        return;

        if (vm.connections.length == 0) return;

        // ideally this would sort by some combination of connected videos, length, confidence, etc
        var sorted = _.sortBy(vm.connections, function(edge) {
          var video = vm.getVideoById(edge.video);
          return -video.length;
        });

        vm.setSourceByVideoId(sorted[0].video, sorted[0].offset);
      };

      // fetch the concert graph and add the first video as a source
      ConcertService.getGraphById(vm.$stateParams.concert_id, function(err, resp) {
        if (err) { debugger; return }

        vm.concert = resp;

        var video_id = parseInt(vm.$stateParams.video_id);
        vm.addSource(video_id);
        vm.keyVideo = video_id;
      });

      // listen for new videogular player instances (created via additions to `playable`)
      vm.onPlayerReady = function(API, videoId) {
        console.log('player ready', videoId);
        if (vm.playable[parseInt(videoId)]) {
          vm.playable[videoId].API = API;
          if (videoId == vm.keyVideo) {
            API.setVolume(0.5);
          } else {
            API.setVolume(0.0);
          }
        }
      };
    }

    return directive;

  }

})();

