'use strict';

angular
  .module('jamjar')
  .factory('ConcertService', function(APIService) {
    var service = this;

    service.model = 'concerts';

    return {
      getConcertById: function(id, callback) {

        APIService.get(service.model, id, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      }
  }
});
