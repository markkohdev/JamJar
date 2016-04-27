
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlayer', jamjarPlayer)
    .directive('jamjarButton', jamjarButton)
    .directive('jamjarPlugin', jamjarPlugin);

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
        function JamJarPlayerController(ConcertService, $sce, $stateParams, $state, VideoService) {
            var vm = this;

            vm.$stateParams = $stateParams;
            
            /*vm.tooltip = {
                showTooltip : false,
                tipDirection : 'bottom'
            };*/

            // this will be a factory with DI
            vm.jamjar = new JamJar(ConcertService, $sce, VideoService);
            vm.jamjar.initialize(parseInt(vm.$stateParams.concert_id), parseInt(vm.$stateParams.video_id));
        }

        return directive;
    }
  
    function jamjarButton (ConcertService) {
        var directive = {
            restrict: "E",
            require: "^videogular",
            template: "<div class='iconButton' ng-click='jjb.setJamJarOverlay()'><img ng-src='assets/images/jamjar_logo_transparent/jamjar_logo_transparent_29x29.png'/></div>",
            link: function(scope, elem, attrs, API, ConcertService) {
                scope.API = API;
                scope.ConcertService = ConcertService;
            },
            controller: JamJarBtnController,
            controllerAs: 'jjb',
            bindToController: true
        }
        
        function JamJarBtnController(ConcertService) {
            var vm = this;
            
            //vm.overlay = new Overlay();
            //vm.showJamJar = overlay.setJamJarOverlay();
        }
        
        return directive;
    }
    
    function jamjarPlugin(ConcertService, VG_STATES) {
        var directive = {
            restrict: "E",
            require: "^videogular",
            templateUrl: 'app/components/jamjarPlayer/jamjarOverlay.tmpl.html',
            link: function(scope, elem, attrs, API, ConcertService) {
                scope.API = API;
                scope.ConcertService = ConcertService;
            },
            controller: JamJarPluginController,
            controllerAs: 'jjp',
            bindToController: true
        }
        
        function JamJarPluginController() {
            var vm = this;
            
            //vm.overlay = new Overlay();
            //vm.showJamJar = overlay.getJamJarOverlay();
        }
        
        return directive;
    }
    
    function Overlay($sce) {
        var self = this;
        var showJamJarOverlay = false;
    }
    
    Overlay.prototype.setJamJarOverlay = function () {
        var self = this;
        self.showJamJarOverlay = !showJamJarOverlay;
    }
    
    Overlay.prototype.getJamJarOverlay = function () {
        var self = this;
        return self.showJamJarOverlay;
    }
    
  function Video(video, edges, $sce) {
    var self = this;

    self.$sce = $sce;
    self.video = video;
    self.API = null;
    self.edges = edges;

    self.buffering = true;
    self.playable = false;

    self.config = self.getConfig();
  }

  Video.prototype.setAPI = function(API) {
    var self = this;

    self.API = API;
    self.playable = true;
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

  Video.prototype.pause = function() {
    var self = this;

    self.API.pause();
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


  function JamJar(concertService, $sce, videoService) {
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
      
                  
    self.videoService = videoService;
  }
    
  JamJar.prototype.getVideoLength = function(video_id){
      var self = this;
      self.videoService.getVideoById(video_id, function(err, resp) {
          if (err) {
            debugger;
            return;
          }
          
          console.log(resp.length);
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

      // we don't want to change the startTime for the currently playing video!
      if (video == self.primaryVideo || !video.API) {
        return;
      }

      self.lastTimeUpdate = new Date();

      var edge = self.getEdge(video);
      var tentativeStartTime = Math.max(playedTime - edge.offset, 0);
      video.offset(tentativeStartTime);
    });
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

         onEnter: _.once(function(currentTime, timeLapse, params) {
           console.log('adding video to queue: ', params.video.video.id);
           params.self.addVideo(params.video);
         }),
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

