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
      vm.played = {};
      vm.rows = 1;
      vm.cols = 1;

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
        var edges = vm.getVideoById(videoId).edges;
        var edge = _.find(edges, {video: parseInt(vm.keyVideo)});
        if (!edge) {
          debugger
        }
        var offset = (vm.getKeyVideo().API.currentTime / 1000.0) + edge.offset;

        console.log("VIDEO", videoId, "OFFSET", offset);

        return offset;
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
        video.loadStart = new Date();
        vm.playable[video.id] = video;
      };

      vm.getPlayableVideos = function() {
        var keyVideo = vm.getKeyVideo();

        if (!keyVideo) {
          debugger
        }
        var playableEdges = _.filter(keyVideo.edges, function(edge) {
          // require video length to be < requested offset position AND offset > 0
          var video = vm.getVideoById(edge.video);
          var offset = (vm.getKeyVideo().API.currentTime / 1000.0) - edge.offset;
          return offset > 0 && offset < video.length && edge.confidence >= 5 && !vm.played[edge.video];
        });

        return _.map(playableEdges, function(edge) {
          return vm.getVideoById(edge.video);
        });
      };

      vm.onUpdateSource = function(src, videoId) {
        vm.cols = _.keys(vm.playable).length;
      },

      vm.onUpdateState = function(state, videoId) {
        vm.cols = _.keys(vm.playable).length;

        if (state == 'play' && videoId != vm.keyVideo && vm.playable[videoId]) {
          var offset = vm.getOffset(videoId);
          var loadingOffset = (new Date() - vm.playable[videoId].loadStart) / 1000.0;
          //vm.playable[videoId].API.seekTime(offset + loadingOffset);
        }
      };

      vm.onUpdateTime = function(time, videoId) {
        vm.cols = _.keys(vm.playable).length;
        vm.updatePlayable();
      }

      vm.updatePlayable = function() {
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

      vm.onComplete = function(videoId) {
        vm.cols = _.keys(vm.playable).length;
        console.log('on complete', videoId);
        // remove current key from playable
        // promote a new video to be the key
        // pray
        console.log('playable', vm.playable);
        if (_.keys(vm.playable).length <= 1) {
          return;
          // out of videos -- what do we do now??
        }

        console.log('videoId', videoId, 'vm.keyVideo', vm.keyVideo);
        if (videoId == vm.keyVideo) {
          var potentialKeys = _.without(_.keys(vm.playable), videoId);
          // ideally this wouldn't be done randomly... function of confidence, upvotes, etc
          var keyIndex = _.random(0, potentialKeys.length - 1); // inclusive
          var newKeyVideo = potentialKeys[keyIndex];

          vm.keyVideo = newKeyVideo;
          vm.getKeyVideo().API.setVolume(0.0);
        }
        // if key video (or otherwise), delete form playable and update accordingly
        vm.played[videoId] = 1;
        delete vm.playable[videoId];
        console.log("DELETED", videoId, "from playable");
        console.log(vm.playable);

        vm.updatePlayable();
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
            API.setVolume(0.0);
          } else {
            API.setVolume(0.0);
          }
        }
      };
    }

    return directive;

  }

})();

