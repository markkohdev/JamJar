
angular
  .module('jamjar')
  .factory('authInterceptor', function ($rootScope, $q, AuthService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      var token = AuthService.getToken();
      if (token) {
        config.headers.Authorization = 'Token ' + token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        AuthService.onUnauthorized();
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

angular
  .module('jamjar')
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
