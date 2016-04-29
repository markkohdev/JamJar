
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlayer', jamjarPlayer)

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

            /*vm.tooltip = {
                showTooltip : false,
                tipDirection : 'bottom'
            };*/

            // this will be a factory with DI
            vm.jamjar = new JamJar(ConcertService, $sce);
            vm.jamjar.initialize(parseInt(vm.$stateParams.concert_id), parseInt(vm.$stateParams.video_id));

            vm.overlay = {
              visible: true,
            }

            vm.toggleOverlay = function() {
              vm.overlay.visible = !vm.overlay.visible;
            }

        }

        return directive;
    }
  
  function Video(video, edges, $sce) {
    var self = this;

    self.$sce = $sce;
    self.video = video;
    self.API = null;
    self.edges = edges;

    self.whenLoaded = [];

    self.buffering = true;
    self.currentState = 'pause';
    self.ready = false;
    self.playable = false;

    self.presentation = {
      offset: '10em',
      width: '20em',
      playable: false,
    }

    self.config = self.getConfig();
  }

  Video.prototype.updatePresentatonDetails = function(primaryVideo, edgeToPrimary) {
    var self = this;

    var offset = self.calcOffsetMargin(primaryVideo, edgeToPrimary);
    self.presentation.offset = offset + 'em';
    self.presentation.width  = (self.video.length - self.time()) + "em"
    self.presentation.playable = offset == 0;
  };

  Video.prototype.calcOffsetMargin = function(primaryVideo, edgeToPrimary) {
    if (primaryVideo == self) {
      return 0;
    }

    var offset = edgeToPrimary.offset * -1;
    if (offset < 0) {
      return 0;
    }

    var margin = offset - primaryVideo.time();
    return Math.max(margin, 0);
  }

  Video.prototype.setAPI = function(API) {
    var self = this;

    self.ready = true;
    self.API = API;

    var f;
    while (f = self.whenLoaded.pop()) {
      f(self.API);
    }
  }

  Video.prototype.time = function() {
    var self = this;

    return self.API.currentTime / 1000.0;
  };

  Video.prototype.volume = function(vol) {
    var self = this;

    if (self.API)
      self.API.setVolume(vol);
  };

  Video.prototype.play = function() {
    var self = this;

    if (!self.API) {
      self.whenLoaded.push(function(API) {
        API.play
      });
      return;
    }

    if (self.currentState != 'play') {
      self.currentState = 'play';
      self.API.play();
    }
  }

  Video.prototype.pause = function() {
    var self = this;

    if (!self.API) {
      self.whenLoaded.push(function(API) {
        API.pause();
      })
      return;
    }

    if (self.currentState != 'pause') {
      self.currentState = 'pause';
      self.API.pause();
    }
  }

  Video.prototype.offset = function(seconds) {
    var self = this;

    if (!self.API) {
      self.whenLoaded.push(function(API) {
        API.seekTime(seconds);
      });
      return;
    }

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

    window.self = self;

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

    // performance hack
    self.lastTimeUpdate = null;

    // default volume for videos
    self.volume = 0.5; // 0.5
  }

  JamJar.prototype.getVideoLength = function(video_id){
      var self = this;
      self.videoService.getVideoById(video_id, function(err, resp) {
          if (err) {
            debugger;
            return;
          }
          
          return resp.length;
      });
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
      _.each(self.concert.videos, function(video) {
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
      self.primaryVideo.buffering = true; // start playing immediately!

      self.addVideo(self.primaryVideo);

      self.resetEdges();
    });
  };

  JamJar.prototype.muteAll = function() {
    var self = this;
    _.each(self.nowPlaying, function(video) {
      video.volume(0.0);
    });
  }

  JamJar.prototype.switchVideo = function(selectedVideo) {
    var self = this;

    self.primaryVideo.pause();
    self.muteAll();

    var edge = self.getEdge(selectedVideo);

    // this seems to work well, but it breaks if the video is paused!!
    //var diff = (new Date() - self.lastTimeUpdate) / 1000.0;
    var offset = self.primaryVideo.time() - edge.offset;// + diff;

    self.primaryVideo = selectedVideo;
    self.primaryVideo.volume(self.volume);

    self.primaryVideo.offset(offset);
    self.primaryVideo.play();

    self.resetEdges();
  }

  JamJar.prototype.switchVideoDirect = function(selectedVideo, offset) {
    var self = this;

    self.muteAll();

    self.primaryVideo = selectedVideo;
    self.primaryVideo.volume(self.volume);

    self.primaryVideo.offset(offset);
    self.primaryVideo.play();

    self.resetEdges();
  }

  JamJar.prototype.mouseover = function(selectedVideo) {
    var self = this;
  }

  JamJar.prototype.getEdge = function(other) {
    var self = this;

    var edge = _.find(self.primaryVideo.edges, {video: other.video.id});

    return edge || {};
  }

  JamJar.prototype.getBufferInfo = function(video) {
    var self = this;

    var buffered = video.API.buffered;

    return _.map(_.range(buffered.length), function(i) {
      return Math.floor(buffered.start(i)) + "-" + Math.floor(buffered.end(i));
    }).join(",");
  }

  JamJar.prototype.addVideo = function(video) {
    var self = this;

    if (_.indexOf(self.nowPlaying, video) == -1) {
      self.nowPlaying.push(video);
    }
  };

  JamJar.prototype.removeVideo = function(video) {
    var self = this;

    var index = _.indexOf(self.nowPlaying, video);

    if (index >= 0) {
      self.nowPlaying.splice(index, 1);
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

    self.removeVideo(video);

    if (video != self.primaryVideo) {
      return;
    }

    // primary video ended, have to reconcile everything here
    if (self.nowPlaying.length > 0) {
      var next = self.nowPlaying[0];
      var edge = self.getEdge(next);
      var offset = video.video.length - edge.offset;
      self.switchVideoDirect(next, offset);
    }
  }

  JamJar.prototype.onUpdateTime = function(playedTime, duration, updatedVideo) {
    var self = this;

    // queued videos get an initial onUpdateTime -- ignore that
    if (updatedVideo != self.primaryVideo) {
      return;
    }

    _.each(self.nowPlaying, function(video) {
      self.lastTimeUpdate = new Date();

      var edge = self.getEdge(video);
      var tentativeStartTime = Math.max(playedTime - edge.offset, 0);

      // we don't want to change the startTime for the currently playing video!
      if (video != self.primaryVideo && video.API) {
        video.offset(tentativeStartTime);
      }

      // update all videos for the presentation layer
      video.updatePresentatonDetails(self.primaryVideo, edge);

    });
  }

  JamJar.prototype.onUpdateSource = function(source, video) {
    var self = this;
  }

  JamJar.prototype.onUpdateState = function(state, primaryVideo, isPrimary) {
    var self = this;

    if (!isPrimary) return;

    if (state == 'play') {
      _.each(self.nowPlaying, function(video) {
        video.play();
      });
    } else if (state == 'pause') {
      _.each(self.nowPlaying, function(video) {
        video.pause();
      });
    }
  }

  JamJar.prototype.resetEdges = function () {
    var self = this;

    _.each(self.cuePoints, function(cue, index) {
      delete self.cuePoints[index];
    });

    _.each(self.primaryVideo.edges, function(edge) {
      var video = self.videos[edge.video];

      if (edge.confidence > 20) {
        // if the edge video starts before current, then queue it immediately!
        var queueTime = Math.max(0, edge.offset);

        // remove it when the video ends!
        var removeTime = edge.offset + video.video.length;

        self.addPlayerEdge(video, queueTime, removeTime);
        self.addVideo(video);
      }
    });

  };

  JamJar.prototype.addPlayerEdge = function (video, queueTime, removeTime) {
    var self = this;

    var cuePoint = [
      {
         timeLapse:{
           start: queueTime,
           end: removeTime
         },
         onUpdate: function(currentTime, timeLapse, params) {},
         onLeave: function(currentTime, timeLapse, params) {},
         onEnter: function(currentTime, timeLapse, params) {
           params.video.playable = true;
         },

         onComplete: _.once(function (currentTime, timeLapse, params) {
           console.log('removing video w/ id:', params.video.video.id);
           params.self.removeVideo(params.video);
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

