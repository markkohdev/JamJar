'use strict';

angular
  .module('jamjar')
  .factory('UserService', function(APIService) {
    var service = this;

    service.model = 'users';

    return {
      getProfile: function(username, callback) {

        APIService.get(service.model, username, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },
    }

});
