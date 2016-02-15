'use strict';

angular
  .module('jamjar')
  .factory('TokenService', function(localStorageService, $state) {
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
        },

        onUnauthorized: function() {
          this.clearToken();
          $state.go('landing');
        }
    }

});
