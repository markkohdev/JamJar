'use strict';

angular
  .module('jamjar')
  .factory('AuthService', function(APIService, TokenService, localStorageService) {
    var service = this;

    return {
      logIn: function(data, callback) {
        var service = this;

        APIService.postPath('auth/login/', data, function(err, resp) {
          if (err) {
            TokenService.clearToken();
            return callback(err);
          }

          TokenService.setToken(resp.token.key);
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

      setUser: function(user) {
        var service = this;

        localStorageService.set('user', user);
      },

      getUser: function() {
        var service = this;

        return localStorageService.get('user');
      },
  }
});
