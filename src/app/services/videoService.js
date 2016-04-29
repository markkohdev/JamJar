'use strict';

angular
  .module('jamjar')
  .factory('VideoService', function(APIService) {
    var service = this;

    service.model = 'videos';

    return {
      getVideoById: function(id, callback) {

        APIService.get(service.model, id, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      getVideos: function(query, callback) {
        var keys = ["genres", "artists", "users"];

        var endpoint = "videos/";
        _.each(keys, function(key, index) {
          var token = index == 0 ? "?" : "&";
          var values = query[key];
          if (!values) {
            values = [];
          } else if (!_.isArray(values)) {
            values = [values];
          }

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

