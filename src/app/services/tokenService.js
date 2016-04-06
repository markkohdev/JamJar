'use strict';

angular
  .module('jamjar')
  .factory('TokenService', function(localStorageService, $injector) {
    var service = this;

    return {
        setToken: function(token) {
          localStorageService.set('token', token);
        },

        getToken: function() {
          return localStorageService.get('token');
        },

        clearToken: function() {
          localStorageService.remove('token');
          localStorageService.remove('user');
        },

        onUnauthorized: function() {
          this.clearToken();
          $injector.get('$state').go('landing');
        }
    }

});
