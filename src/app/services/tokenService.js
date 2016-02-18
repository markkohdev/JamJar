'use strict';

angular
  .module('jamjar')
  .factory('TokenService', function($window) {
    var service = this;

    return {
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
        }
    }

});
