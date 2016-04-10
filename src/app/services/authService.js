'use strict';

angular
  .module('jamjar')
  .factory('AuthService', function(APIService, TokenService, localStorageService) {
    var service = this;

    return {
      logIn: function(data, callback) {
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
        APIService.postPath('auth/signup/', data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      activate: function(data, callback) {
        APIService.postPath('auth/activate/', data, function(err, resp) {
          if (err) return callback(err);

          callback(null, resp);
        });
      },

      setUser: function(user) {
        localStorageService.set('user', user);
      },

      getUser: function() {
        return localStorageService.get('user');
      }
  }
});
