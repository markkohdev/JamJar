'use strict';

angular
  .module('jamjar')
  .factory('ContactService', function(APIService) {
    var service = this;

    service.model = 'feedback';

    return {
      sendFeedback: function(data, callback) {
        APIService.post(service.model, data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      }
    }

});
