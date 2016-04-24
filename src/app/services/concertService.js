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
      },

      list: function(callback) {
        APIService.list(service.model, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      getGraphById: function(id, callback) {
        APIService.get(service.model, id, callback);
      },

      getOrCreateConcert: function(data, callback) {
        APIService.post(service.model, data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      }
  }
});
