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

      // this will be a factory with DI
      vm.jamjar = new JamJar(ConcertService, $sce);
      vm.jamjar.initialize(parseInt(vm.$stateParams.concert_id), parseInt(vm.$stateParams.video_id));
    }

    return directive;

  }

  function Video(video, edges, $sce) {
    var self = this;

    self.$sce = $sce;
    self.video = video;
    self.API = null;
    self.edges = edges;

    self.buffering = true;

    self.config = self.getConfig();
  }

  Video.prototype.setAPI = function(API) {
    var self = this;

    self.API = API;
  }

  Video.prototype.time = function() {
    var self = this;

    return self.API.currentTime / 1000.0;
  };

  Video.prototype.volume = function(vol) {
    var self = this;

    self.API.setVolume(vol);
  };

  Video.prototype.play = function(offset) {
    var self = this;

    if (!self.API) {
      return;
    } else {
      self.API.play();
    }
  }

  Video.prototype.offset = function(seconds) {
    var self = this;

    self.API.seekTime(seconds);
  }

  Video.prototype.getConfig = function() {
    var self = this;

    var url = self.$sce.trustAsResourceUrl(self.video.web_src);

    return {
      sources: [{src: url, type: 'video/mp4'}],
      theme: "bower_components/videogular-themes-default/videogular.css",
    };
  };


  function JamJar(concertService, $sce) {
    var self = this;

    // stopgap until this becomes a factory with DI
    self.concertService = concertService;
    self.$sce = $sce;

    // concert information
    self.concert = null;

    // video that other relatives are played relative to
    self.primaryVideo = null;

    // hash of video_id --> video object
    self.videos = {};

    // list of videos that should be rendered in the view
    self.nowPlaying = [];

    // used by Videogular to emit events at certain times
    self.cuePoints = {};

    self.max_videos = 3;
    self.bufferTime = 3; // seconds

    self.volume = 0.5; // 0.5
  }

  JamJar.prototype.initialize = function(concert_id, video_id) {
    var self = this;

    self.concertService.getGraphById(concert_id, function(err, resp) {
      if (err) {
        debugger;
        return
      }

      self.concert = resp;

      // encapsulate videos in Video class
      _.each(self.concert.concert.videos, function(video) {
        //
        // these subgraphs are disjoint, so find the first subgraph
        // containing this video  -- it's the only one
        var graph = _.find(self.concert.graph, function(subgraph) {
          return !!subgraph.adjacencies[video.id];
        });

        var edges = graph.adjacencies[video.id];
        self.videos[video.id] = new Video(video, edges, self.$sce);
      });

      // use video_id passed to initialize as primary video. Video offsets will be calculated
      // relative to this video until the primary video ends. Then, an adjacent video will be
      // promoted to be the new primary video.
      self.primaryVideo = self.videos[video_id];
      self.primaryVideo.buffering = false; // start playing immediately!

      self.addVideo(self.primaryVideo);

      self.addEdges();
    });
  };

  JamJar.prototype.click = function(selectedVideo) {
    var self = this;
    _.each(self.nowPlaying, function(video) {
      var vol = (selectedVideo == video) ? self.volume : 0.0;
      video.volume(vol);
    });
  }

  JamJar.prototype.mouseover = function(selectedVideo) {
    var self = this;
  }

  JamJar.prototype.addVideo = function(video) {
    var self = this;

    if (self.nowPlaying.length < self.max_videos) {
      self.nowPlaying.push(video);
      self.cols = self.nowPlaying.length;
    }
  };

  JamJar.prototype.onPlayerReady = function(API, video) {
    var self = this;

    video.setAPI(API);
    if (video == self.primaryVideo) {
      video.volume(self.volume);
    } else {
      video.volume(0.0);
    }
  }

  JamJar.prototype.onComplete = function(video) {
    var self = this;

    var nowPlayingIndex = _.indexOf(self.nowPlaying, video);
    self.nowPlaying.splice(nowPlayingIndex, 1);

    if (self.nowPlaying.length == 0)
      return ; // what do we do here?

    if (self.primaryVideo == video) {
      self.primaryVideo = self.nowPlaying[0];
      self.primaryVideo.volume(self.volume);

      _.each(self.cuePoints, function(cue, index) {
        delete self.cuePoints[index];
      });

      self.addEdges();
    } else {
      _.each(self.primaryVideo.edges, function(edge) {
        var video = self.videos[edge.video];

        if (_.indexOf(self.nowPlaying, video)) {
          return;
        }
      });

    }
  }

  JamJar.prototype.onUpdateTime = function(time, video) {
    var self = this;
  }

  JamJar.prototype.onUpdateSource = function(source, video) {
    var self = this;
  }

  JamJar.prototype.onUpdateState = function(state, video) {
    var self = this;

    if (video.buffering) {
      video.buffering = false;
      video.API.pause();
    }
  }

  JamJar.prototype.addEdges = function () {
    var self = this;

    // for each edge that this video links to
    // add cuepoint to
    //  1) queue it N seconds before it's needed
    //  2) play it when it's needed!

    _.each(self.primaryVideo.edges, function(edge) {
      var video = self.videos[edge.video];

      if (edge.offset > 0) {
        var queueTime = Math.max(edge.offset - self.bufferTime, 0.1);
        var startTime = edge.offset;

        self.addPlayerEdge(video, queueTime, startTime);
      }
    });

  };

  JamJar.prototype.addPlayerEdge = function (video, queueTime, startTime) {
    var self = this;

    var cuePoint = [
      {
         timeLapse:{
           start: queueTime,
           end: startTime
         },
         onUpdate: function(currentTime, timeLapse, params) {},
         onLeave: function(currentTime, timeLapse, params) {},

         onEnter: _.once(function(currentTime, timeLapse, params) {
           console.log('queuing video ' + params.video.video.id);
           params.self.addVideo(params.video);
         }),
         onComplete: _.once(function (currentTime, timeLapse, params) {
           var diff = currentTime - timeLapse.end;
           console.log('playing video ' + params.video.video.id, 'with offset ' + diff);
           // diff seems like it should matter, but it makes the overlap _worse_
           //params.video.play(diff);
           params.video.play(0.0);
         }),
         params: {
           video: video,
           self: self
         }
      }
    ];

    self.cuePoints[video.video.id] = cuePoint;
  }

})();

