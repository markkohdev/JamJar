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
    function JamJarPlayerController(ConcertService, $sce) {
      var vm = this;

      vm.API = null;
      vm.concert = {};
      vm.connections = [];
      vm.nowPlaying = {};
      vm.start_time = 0;

      vm.setSource = function(src, offset) {
        //vm.API.stop();

        var adjusted_time = (vm.API.currentTime / 1000.0) - offset;

        var new_source = [{src: $sce.trustAsResourceUrl(src), type: 'video/mp4'}];
        vm.config = {
          sources: new_source,
          theme: "bower_components/videogular-themes-default/videogular.css",
        };

        // annoying -- API is broken. Pass directly into directive via scope var
        vm.start_time = adjusted_time;
        console.log("Seeking to " + adjusted_time + " seconds");
      };

      vm.getVideoById = function(video_id) {
        return _.find(vm.concert.graph, function(node) {
          return node.video.id == video_id;
        });
      };

      vm.setSourceByVideoId = function(video_id, offset_seconds) {
        if (!offset_seconds) {
          offset_seconds = 0;
        }

        var node = vm.getVideoById(video_id);

        vm.connections = node.connects_to;
        vm.nowPlaying = node;
        vm.setSource(node.video.web_src, offset_seconds);
      };

      vm.getValidConnections = function() {
        return _.filter(vm.nowPlaying.connects_to, function(node) {
          // require node's video length to be < requested offset position AND offset > 0
          var adjusted_time = (vm.API.currentTime / 1000.0) - node.edge.offset;
          return adjusted_time > 0 && adjusted_time < node.video.length && node.edge.confidence >= 5;
        });
      };

      vm.onUpdateTime = function() {
        // this gets called often... maybe not the best way to handle it..
        vm.connections = vm.getValidConnections();
      };

      vm.onComplete = function() {
        var validConnections = vm.getValidConnections();

        if (validConnections.length == 0) return;

        // ideally this would sort by some combination of connected videos, length, confidence, etc
        var sorted = _.sortBy(validConnections, function(node) {
          return -node.video.length;
        });

        vm.setSourceByVideoId(sorted[0].video.id, sorted[0].edge.offset);
      };

      vm.onPlayerReady = function(API) {
        console.log("player is ready!");
        vm.API = API;

        vm.API.vgUpdateTime = function(time, duration) {
          console.log("time", time, duration);
        };

        vm.API.vgError = function(err) {
          console.log("Error", err);
        };

        vm.API.vgChangeSource = function(src) {
          console.log("Source", src);
        };


        ConcertService.getGraphById(1, function(err, resp) {
          if (err) { debugger; return }

          vm.concert = resp;

          var firstVideoId = 1;
          var node = vm.getVideoById(firstVideoId);

          vm.nowPlaying = node;

          vm.setSourceByVideoId(firstVideoId, 0);

          //vm.config = {
          //  sources: [{src: $sce.trustAsResourceUrl(node.video.web_src), type: "video/mp4"}],
          //  theme: "bower_components/videogular-themes-default/videogular.css",
          //};
        });
      };
    }

    return directive;

  }

})();

