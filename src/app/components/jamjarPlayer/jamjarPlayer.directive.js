
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
        function JamJarPlayerController(ConcertService, VideoService, $sce, $stateParams, $state, $mdDialog, $mdMedia, $timeout) {
            var vm = this;

            /*vm.tooltip = {
                showTooltip : false,
                tipDirection : 'bottom'
            };*/

            // this will be a factory with DI
            vm.jamjar = new JamJar(ConcertService, VideoService, $sce);
            vm.jamjar.initialize(parseInt($stateParams.concert_id), parseInt($stateParams.video_id), $stateParams.type);

            vm.individual = $stateParams.type == 'individual';

            vm.jamjar.onPlay = function(video) {
              video.views += 1;
              VideoService.view(video.id, function(err, resp) {
                console.log(err, resp);
              });
            }

            window.jamjar = vm.jamjar;

            vm.overlay = {
              visible: false,
              timeout: null,
              mouse: {pageX: 0, pageY: 0},
              state: null,
            };

            vm.onHoverOut = function(event) {
              if (vm.overlay.timeout) {
                $timeout.cancel(vm.overlay.timeout);
                vm.overlay.timeout = null;
              }

              vm.overlay.visible = false;
            }

            vm.onHover = function(event) {

              if (vm.overlay.state != 'auto')
                return

              // make overlay visible
              var timeoutMs = 3000;

              if (event.pageX == vm.overlay.mouse.pageX && event.pageY == vm.overlay.mouse.pageY) {
                return;
              } else {
                vm.overlay.mouse.pageX = event.pageX;
                vm.overlay.mouse.pageY = event.pageY;
              }

              vm.overlay.visible = true;

              // set timeout to make it invisible
              var timeout = $timeout(function() {
                vm.overlay.visible = false;
                vm.overlay.timeout = null;
              }, timeoutMs);

              // if timeout already exists
              // delete it and create a new one
              if (vm.overlay.timeout) {
                $timeout.cancel(vm.overlay.timeout);
              }
              vm.overlay.timeout = timeout;
            }

            vm.vote = function(voteType) {
              if (!vm.jamjar.primaryVideo) return;

              var votes = vm.jamjar.primaryVideo.video.votes;
              var vote = _.find(votes.video_votes, {'vote': voteType});

              if (!vote) {
                vote = {vote: voteType, total: 0}
                votes.video_votes.push(vote);
              }

              var voteDelta = 1;

              if (voteType === votes.user_vote) {
                voteType = null;
                voteDelta = -1;
              } else if (voteType !== votes.user_vote && votes.user_vote !== null) {
                // if it's the opposite of before, then subtract from before vote total
                var oldVote = _.find(votes.video_votes, function(vote) { return vote['vote'] !== voteType });
                if (oldVote)
                  oldVote.total -= 1;
              }

              vote.total += voteDelta;
              votes.user_vote = voteType;

              // then send vote to API
              var video_id = vm.jamjar.primaryVideo.video.id;
              VideoService.vote(video_id, voteType, function(err, resp) {
                console.log(err, resp);
              });
            }

            vm.getVotes = function(voteType) {
              if (!vm.jamjar.primaryVideo) return;

              var votes = vm.jamjar.primaryVideo.video.votes.video_votes;
              var vote = _.find(votes, {'vote': voteType});
              return _.get(vote, 'total', 0);
            }

            vm.userVote = function(voteType) {
              if (!vm.jamjar.primaryVideo) return;

              var vote = vm.jamjar.primaryVideo.video.votes.user_vote;
              return vote == voteType;
            }

            vm.showFlagForm = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
                var video_id = _.get(vm.jamjar, 'primaryVideo.video.id', null);
                
                $mdDialog.show({
                    locals: {video_id: video_id},
                    controller: FlagDialogController,
                    templateUrl: 'app/components/jamjarPlayer/flag.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                });
            };

            vm.toggleOverlay = function(state) {
              if (state == 'off') {
                vm.overlay.visible = false;
                vm.overlay.state = null;
              } else if (state == 'on') {
                vm.overlay.state = null;
                vm.overlay.visible = true;
                if (vm.overlay.timeout) {
                  $timeout.cancel(vm.overlay.timeout);
                }
              } else if (state == 'auto') {
                vm.overlay.visible = true;
                vm.overlay.state = 'auto';
              }
            };

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

    if (!self.API)
      return

    if (self.API.currentState != 'play')
      _.defer(self.API.play.bind(self.API));
  }

  Video.prototype.pause = function(reason) {
    var self = this;

    if (!self.API)
      return

    if (self.API.currentState != 'pause' && self.API.currentState != 'stop') {
      //console.log("pausing, reason: ", reason, self.video.id);
      _.defer(self.API.pause.bind(self.API));
    }
  }

  Video.prototype.offset = function(seconds) {
    var self = this;

    if (!self.API) return;

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

    // performance hack
    self.lastTimeUpdate = null;

    self.onPlay = function() { }; // override this!
    self.onPlayRecorded = {};

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
      self.loadVideo(concert_id, video_id);
    } else if (self.type == 'jamjar') {
      self.loadGraph(concert_id, video_id);
    } else {
      console.error("Invalid type given: ", type);
    }
  };

  JamJar.prototype.loadVideo = function(concert_id, video_id) {
    self.videoService.getVideoById(video_id, function(err, video) {
      if (err) {
        return console.error(err);
      }

      self.primaryVideo = new Video(video, {}, self.$sce);
      self.primaryVideoEdges = {};
      self.primaryVideo.buffering = true;

      self.addVideo(self.primaryVideo)
    });
    
    self.concertService.getConcertById(concert_id, function(err, resp) {
        self.concert = resp;
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
      return self.switchVideo(selectedVideo, false);
    }
  }

  JamJar.prototype.switchVideo = function(selectedVideo, isDirect) {
    var self = this;

    var edge = self.getEdge(selectedVideo);

    // this seems to work well, but it breaks if the video is paused!!
    //var diff = (new Date() - self.lastTimeUpdate) / 1000.0;
    var offset = self.primaryVideo.time() - edge.offset;// + diff;

    selectedVideo.offset(offset);
    selectedVideo.volume(self.volume);

    if (!isDirect) {
      self.primaryVideo.volume(0.0);
    }

    if (isDirect) {
      self.primaryVideo = selectedVideo;
      self.primaryVideo.play();
      _.defer(self.primaryVideo.play.bind(self.primaryVideo));
    } else {
      var previousState = self.primaryVideo.API.currentState;
      self.primaryVideo = selectedVideo;
      if (previousState == 'pause') {
        self.primaryVideo.pause();
      } else {
        self.primaryVideo.play();
      }
    }

    self.resetEdges();

    _.each(self.nowPlaying, function(video) {
      edge = self.getEdge(video);
      video.updatePresentationDetails(self.primaryVideo, edge);

      if (video != self.nowPlaying) {
        video.pause();
      }
    });

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

    if (!video.API) return "none";
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

  JamJar.prototype.onPlayerCanPlay = function(video) {
    var self = this;

  }


  JamJar.prototype.onPlayerReady = function(API, video) {
    var self = this;

    video.setAPI(API);

    if (video == self.primaryVideo) {
      video.volume(self.volume);
    } else {
      video.volume(0.0);
      video.pause("PLAYER CAN PLAY");
    }
  }

  JamJar.prototype.onComplete = function(video) {
    var self = this;

    //console.log("COMPLETE:", video.video.id);
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
      self.switchVideo(next, true);
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

    // update view count
    var video = self.primaryVideo.video;
    if (!self.onPlayRecorded[video.id]) {
      self.onPlayRecorded[video.id] = true
      self.onPlay(video);
    }
  }

  JamJar.prototype.onUpdateSource = function(source, video) {
    var self = this;
  }

  JamJar.prototype.onUpdateState = function(state, video) {
    var self = this;

    //console.log("STATE:", video.video.id, video.video.name, video.API.currentState, state);
  }

  JamJar.prototype.resetEdges = function () {
    var self = this;

    var all_edges = {}; // video_id --> adjusted_edge

    function recursiveAddEdges(source_video, default_offset) {
      var video_id = source_video.video.id;

      _.each(source_video.edges, function(edge) {
        // if we've already recorded this video or it's a low quality match, skip it!
        if (all_edges[edge.video] || edge.confidence <= 20) {
          return;
        }

        var video = self.videos[edge.video];

        // remove it when the video ends!
        var removeTime = default_offset + edge.offset + video.video.length;

        if (removeTime > 2.0) {
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

  /** @ngInject */
  function FlagDialogController($scope, $mdDialog, VideoService, video_id) {
      var vm = $scope;

      vm.flagTypes = [{value: 'A', text: 'Accuracy'}, {value: 'I', text: 'Inappropriate'}, {value: 'Q', text: 'Quality'}];
      
      vm.flag = {
          video: video_id,
          flag_type: '',
          notes: ''
      };
      
      vm.hide = function() {
          $mdDialog.hide();
      };
      
      vm.cancel = function() {
          $mdDialog.cancel();
      };
      
      vm.submitReport = function(){
          VideoService.submitFlag(vm.flag, function(err, resp) {
            vm.flagSent = true;
          });
      };
  }

})();
