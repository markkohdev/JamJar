
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
        function JamJarPlayerController(ConcertService, VideoService, $sce, $stateParams, $state) {
            var vm = this;

            /*vm.tooltip = {
                showTooltip : false,
                tipDirection : 'bottom'
            };*/

            // this will be a factory with DI
            vm.jamjar = new JamJar(ConcertService, VideoService, $sce);
            vm.jamjar.initialize(parseInt($stateParams.concert_id), parseInt($stateParams.video_id), $stateParams.type);

            vm.overlay = {
              visible: false,
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
      offset: '0px',
      width: '0px',
      playable: false,
      preload: 'none',
    }

    self.config = self.getConfig();
  }

  Video.prototype.onLoad = function(fn) {
    var self = this;

    if (!self.API) {
      self.whenLoaded.push(function(API) {
        fn(API);
      });
    } else {
      fn(API);
    }
  };

  Video.prototype.updatePresentationDetails = function(primaryVideo, edgeToPrimary) {
    var self = this;

    var offset = self.calcOffsetMargin(primaryVideo, edgeToPrimary);
    self.presentation.offset = 10 * offset + 'px';
    self.presentation.width  = 10 * (self.video.length - self.time()) + "px"
    self.presentation.playable = (offset == 0);

    if (self.presentation.playable) {
      self.presentation.preload = 'preload';
    }
  };

  Video.prototype.calcOffsetMargin = function(primaryVideo, edgeToPrimary) {
    var self = this;

    if (primaryVideo == self) {
      return 0;
    }

    var offset = edgeToPrimary.offset;
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

    _.defer(function() {
      var f;
      while (f = self.whenLoaded.pop()) {
        f(self.API);
      }
    });
  }

  Video.prototype.time = function() {
    var self = this;

    if (self.API) {
      return self.API.currentTime / 1000.0;
    } else {
      return 0; //hack
    }
  };

  Video.prototype.volume = function(vol) {
    var self = this;

    if (self.API)
      self.API.setVolume(vol);
  };

  Video.prototype.play = function() {
    var self = this;

    console.log("PLAY:", self.video.id);

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


  function JamJar(concertService, videoService, $sce) {
    var self = this;

    window.self = self;

    // stopgap until this becomes a factory with DI
    self.concertService = concertService;
    self.videoService = videoService;
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

  JamJar.prototype.initialize = function(concert_id, video_id, type) {
    var self = this;

    self.type = type;

    if (self.type == 'individual') {
      self.loadVideo(video_id);
    } else if (self.type == 'jamjar') {
      self.loadGraph(concert_id, video_id);
    } else {
      console.error("Invalid type given: ", type);
    }
  };

  JamJar.prototype.loadVideo = function(video_id) {
    self.videoService.getVideoById(video_id, function(err, video) {
      if (err) {
        return console.error(err);
      }

      self.primaryVideo = new Video(video, {}, self.$sce);
      self.primaryVideo.buffering = true;

      self.primaryVideo.onLoad(function(API) {
        API.play();
      });

      self.addVideo(self.primaryVideo)
    });
  };

  JamJar.prototype.loadGraph = function(concert_id, video_id) {
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
      self.primaryVideo.playable = true;

      self.addVideo(self.primaryVideo);

      self.resetEdges();

      self.primaryVideo.onLoad(function(API) {
        API.play();
      });

    });
  };

  JamJar.prototype.muteAll = function() {
    var self = this;
    _.each(self.nowPlaying, function(video) {
      video.volume(0.0);
    });
  }

  JamJar.prototype.handleSwitch = function(selectedVideo) {
    var self = this;

    if (!selectedVideo.presentation.playable) {
      return;
    } else {
      return self.switchVideo(selectedVideo);
    }
  }

  JamJar.prototype.switchVideo = function(selectedVideo) {
    var self = this;

    self.muteAll();

    var edge = self.getEdge(selectedVideo);

    // this seems to work well, but it breaks if the video is paused!!
    //var diff = (new Date() - self.lastTimeUpdate) / 1000.0;
    var offset = self.primaryVideo.time() - edge.offset;// + diff;

    var previousState = self.primaryVideo.API.currentState;

    self.primaryVideo = selectedVideo;
    self.primaryVideo.volume(self.volume);

    self.primaryVideo.offset(offset);

    self.resetEdges();

    _.each(self.nowPlaying, function(video) {
      edge = self.getEdge(video);
      video.updatePresentationDetails(self.primaryVideo, edge);
    });

    if (previousState == 'pause') {
      _.defer(self.primaryVideo.pause.bind(self.primaryVideo));
    } else {
      _.defer(self.primaryVideo.play.bind(self.primaryVideo));
    }
  }

  JamJar.prototype.switchVideoDirect = function(selectedVideo, offset) {
    var self = this;

    self.muteAll();

    self.primaryVideo = selectedVideo;
    self.primaryVideo.volume(self.volume);

    // hack
    self.primaryVideoEdges = {};

    self.primaryVideo.offset(offset);
    self.resetEdges();

    // hack!!! This probably won't work 100% of the time....
    _.defer(self.primaryVideo.play.bind(self.primaryVideo));
  }

  JamJar.prototype.mouseover = function(selectedVideo) {
    var self = this;
  }

  JamJar.prototype.getEdge = function(other) {
    var self = this;

    //var edge = _.find(self.primaryVideo.edges, {video: other.video.id});
    var edge = self.primaryVideoEdges[other.video.id];

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
      // pick the first video which is playable
      var next = _.find(self.nowPlaying, function(vid) {
        return vid.presentation.playable && vid.video.id != self.primaryVideo.video.id;
      });
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
      video.updatePresentationDetails(self.primaryVideo, edge);

    });
  }

  JamJar.prototype.onUpdateSource = function(source, video) {
    var self = this;
  }

  JamJar.prototype.onUpdateState = function(state, primaryVideo, isPrimary) {
    var self = this;
    console.log("STATE:", state);
  }

  JamJar.prototype.resetEdges = function () {
    var self = this;

    // clear all existing cuepoints without deleting the reference to the object
    _.each(self.cuePoints, function(cue, index) {
      delete self.cuePoints[index];
    });


    var all_edges = {}; // video_id --> adjusted_edge

    function recursiveAddEdges(source_video, default_offset) {
      var video_id = source_video.video.id;

      _.each(source_video.edges, function(edge) {
        // if we've already recorded this video or it's a low quality match, skip it!
        if (all_edges[edge.video] || edge.confidence <= 20) {
          return;
        }

        var video = self.videos[edge.video];

        // if the edge video starts before current, then queue it immediately!
        var queueTime = Math.max(0, default_offset + edge.offset - 2);

        // remove it when the video ends!
        var removeTime = default_offset + edge.offset + video.video.length;

        if (removeTime > 2.0) {
          self.addPlayerEdge(video, queueTime, removeTime);
          self.addVideo(video);
        }

        var new_edge = {
          confidence: edge.confidence,
          video: edge.video,
          offset: edge.offset + default_offset
        };

        all_edges[video.video.id] = new_edge;

        recursiveAddEdges(video, default_offset + edge.offset);
      });
    };

    self.primaryVideoEdges = all_edges;

    recursiveAddEdges(self.primaryVideo, 0);
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
         onEnter: _.once(function(currentTime, timeLapse, params) {
           console.log("ON ENTER: ", params.video.video.id);
           params.video.playable = true;
         }),

         onComplete: _.once(function (currentTime, timeLapse, params) {
           console.log('removing video w/ id:', params.video.video.id);
           params.self.onComplete(params.video);
           //params.self.removeVideo(params.video);
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

