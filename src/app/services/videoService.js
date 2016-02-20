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
  }
});

