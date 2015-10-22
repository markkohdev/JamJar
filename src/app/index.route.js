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
      .state('dashboard', {
        url: '/dashboard',
        abstract: true,
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('dashboard.videos', {
        url: '/videos',
        templateUrl: 'app/dashboard/videos.html',
        controller: 'VideosController',
        controllerAs: 'vm'
      })
      .state('dashboard.uploader', {
        url: '/uploader',
        templateUrl: 'app/dashboard/uploader.html',
        controller: 'UploaderController',
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
