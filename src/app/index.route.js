(function() {
  'use strict';

  angular
    .module('jamjar')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('fallfest', {
        url: '/fallfest',
        templateUrl: 'app/fallfest/fallfest.html',
        controller: 'FallfestController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
