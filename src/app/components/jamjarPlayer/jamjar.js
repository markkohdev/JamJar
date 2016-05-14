function JamJar(concertService, videoService, $sce) {
  var self = this;

  // stopgap until this becomes a factory with DI
  self.concertService = concertService;
  self.videoService = videoService;
  self.$sce = $sce;

  // concert information
  self.concert = null;

  // video that is currently playing on the screen
  self.nowPlaying = null;

  // single-source-of-truth for edges (implemented as relative edge from "first" video)
  self.relativeEdges = {};

  // hash of video_id --> video object
  self.videosMap = {};

  // list of videos that should be rendered in the view
  self.videos = [];

  self.onPlay = function() { }; // override this!
  self.onPlayRecorded = {};

  // default volume for videos
  self.volume = 0.5; // 0.5
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

    self.nowPlaying = new Video(video, {}, self.$sce);

    self.videos.push(self.nowPlaying);
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
      self.videosMap[video.id] = new Video(video, edges, self.$sce);
    });

    // use video_id passed to initialize as primary video. Video offsets will be calculated
    // relative to this video until the primary video ends. Then, an adjacent video will be
    // promoted to be the new primary video.
    self.referenceVideo = self.videosMap[video_id];
    self.nowPlaying = self.referenceVideo;

    var edgeData = self.getRelativeEdges(self.referenceVideo);
    self.relativeEdges = edgeData.edges;
    self.videos = edgeData.videos;
    
    var lastVideoEdge = _.maxBy(_.values(self.relativeEdges), 'offset');
    var lastVideo = self.videosMap[lastVideoEdge.video];
    var maxWidth = lastVideoEdge.offset + lastVideo.video.length;

    _.each(self.videos, function(video) {
      var edge = self.getEdge(video);
      video.setPresentationDetails(self.nowPlaying, edge, 0, maxWidth);
    });

  });
};

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
  var offset = self.nowPlaying.time() - edge.offset;// + diff;

  selectedVideo.setOffset(offset);
  selectedVideo.volume(self.volume);

  if (!isDirect) {
    self.nowPlaying.volume(0.0);
  }

  if (isDirect) {
    self.nowPlaying = selectedVideo;
    self.nowPlaying.play();
    _.defer(self.nowPlaying.play.bind(self.nowPlaying));
  } else {
    var previousState = self.nowPlaying.API.currentState;
    self.nowPlaying = selectedVideo;
    if (previousState == 'pause') {
      self.nowPlaying.pause();
    } else {
      self.nowPlaying.play();
    }
  }

  _.each(self.videos, function(video) {
    edge = self.getEdge(video);

    if (video != self.videos) {
      video.pause();
    }
  });

}

JamJar.prototype.getEdge = function(other) {
  var self = this;

  var edge = self.relativeEdges[other.video.id];

  if (!edge) {
    console.error('Could not find desired edge!');
    debugger
  }

  return edge;
}


JamJar.prototype.onPlayerReady = function(API, video) {
  var self = this;

  video.setAPI(API);

  if (video == self.nowPlaying) {
    video.volume(self.volume);
  } else {
    video.volume(0.0);
    video.pause("PLAYER CAN PLAY");
  }
}

JamJar.prototype.onComplete = function(video) {
  var self = this;

  if (video != self.nowPlaying) {
    return;
  }

  // primary video ended, have to reconcile everything here
  if (self.videos.length > 0) {
    // pick the first video which is playable
    var next = _.find(self.videos, function(vid) {
      return vid.presentation.playable && vid.video.id != self.nowPlaying.video.id;
    });
    self.switchVideo(next, true);
  }
}

JamJar.prototype.onUpdateTime = function(playedTime, duration, updatedVideo) {
  var self = this;

  // queued videos get an initial onUpdateTime -- ignore that
  if (updatedVideo != self.nowPlaying) {
    return;
  }

  _.each(self.videos, function(video) {

    var edge = self.getEdge(video);
    var tentativeStartTime = Math.max(playedTime - edge.offset, 0);

    // we don't want to change the startTime for the currently playing video!
    if (video != self.nowPlaying && video.API) {
      video.setOffset(tentativeStartTime);
    }

    // update all videos for the presentation layer
    //video.updatePresentationDetails(self.nowPlaying, edge);
    video.updatePlayable(self.nowPlaying.time() + self.relativeEdges[video.video.id].offset);

  });

  // update view count
  var video = self.nowPlaying.video;
  if (!self.onPlayRecorded[video.id]) {
    self.onPlayRecorded[video.id] = true
    self.onPlay(video);
  }
}

JamJar.prototype.onUpdateSource = function(source, video) {}
JamJar.prototype.onUpdateState = function(state, video) {}
JamJar.prototype.onPlayerCanPlay = function(video) {}


JamJar.prototype.getRelativeEdges = function (reference_video) {
  var self = this;

  var all_edges = {}; // video_id --> adjusted_edge
  var all_videos = [];

  function addVideo(video) {
    if (_.indexOf(all_videos, video) == -1) {
      all_videos.push(video);
    }
  }

  function recursiveAddEdges(source_video, default_offset) {
    var video_id = source_video.video.id;

    _.each(source_video.edges, function(edge) {
      // if we've already recorded this video or it's a low quality match, skip it!
      if (all_edges[edge.video] || edge.confidence <= 20) {
        return;
      }

      var video = self.videosMap[edge.video];

      addVideo(video);


      var new_edge = {
        confidence: edge.confidence,
        video: edge.video,
        offset: edge.offset + default_offset,
      };

      all_edges[video.video.id] = new_edge;

      recursiveAddEdges(video, default_offset + edge.offset);
    });
  };

  recursiveAddEdges(reference_video, 0);

  return {edges: all_edges, videos: all_videos};
};

