'use strict';

angular
  .module('jamjar')
  .factory('AuthService', function(APIService, $cookies) {

    return {
      logIn: function(data, callback) {
        var service = this;

        APIService.postPath('auth/login/', data, function(err, resp) {
          if (err) return callback(err);

          debugger
          callback(null, resp);
        });
      },

      signUp: function(data, callback) {
        var service = this;

        APIService.postPath('auth/signup/', data, function(err, resp) {
          if (err) return callback(err);

          debugger
          callback(null, resp);
        });
      }
  }
});
