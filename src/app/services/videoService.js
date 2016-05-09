'use strict';

angular
  .module('jamjar')
  .factory('VideoService', function(APIService) {
    var service = this;

    service.model = 'videos';

    return {

      listJampicks: function(callback) {

        APIService.getPath(service.model + "/jampicks/", function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });

      },

      submitFlag: function(data, callback) {
        APIService.postPath(service.model + '/flags/', data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });

      },

      vote: function(video_id, vote, callback) {
        var data = {
          video: video_id,
          vote: vote
        }

        APIService.postPath(service.model + '/vote/', data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });

      },

      view: function(video_id, callback) {
        var path = service.model + '/' + video_id + '/' + 'watching/';
        APIService.postPath(path, {}, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });

      },

      getVideoById: function(id, callback) {

        APIService.get(service.model, id, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      getVideos: function(query, callback) {
        var keys = ["genres", "artists", "uploaders"];

        var endpoint = "videos/";
        var first = true;
        _.each(keys, function(key, index) {
          var token = first ? "?" : "&";
          var values = query[key];
          if (!values) {
            return
          } else if (!_.isArray(values)) {
            values = [values];
          }
          first = false;

          var query_part = token + key + "=" + values.join("+")
          endpoint += query_part;
        });

        APIService.getPath(endpoint, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });

      }
  }
});

