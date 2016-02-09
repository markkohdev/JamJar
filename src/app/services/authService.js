'use strict';

angular
  .module('jamjar')
  .factory('AuthService', function(APIService, $window) {
    var service = this;

    return {
      logIn: function(data, callback) {
        var service = this;

        APIService.postPath('auth/login/', data, function(err, resp) {
          if (err) {
            service.clearToken();
            return callback(err);
          }

          service.setToken(resp.token.key);

          callback(null, resp);
        });
      },

      signUp: function(data, callback) {
        var service = this;

        APIService.postPath('auth/signup/', data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      setToken: function(token) {
        $window.localStorage.token = token;
      },

      getToken: function() {
        return $window.localStorage.token;
      },

      clearToken: function() {
        delete $window.localStorage.token;
      },

      onUnauthorized: function() {
        debugger
      },

  }
});
