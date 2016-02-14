(function() {
  'use strict';

  angular
    .module('jamjar')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('landing', {
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
      .state('dashboard.confirm', {
        url: '/auth/confirm',
        templateUrl: 'app/auth/confirm.html',
        controller: 'SignupConfirmController',
        controllerAs: 'controller'
      })
      .state('dashboard.activate', {
        url: '/auth/activate/',
        templateUrl: 'app/auth/activate.html',
        controller: 'SignupActivateController',
        controllerAs: 'controller'
      })
      .state('dashboard.discover', {
        url: '/discover',
        templateUrl: 'app/dashboard/discover/discover.html',
        controller: 'DiscoverController',
        controllerAs: 'vm'
      })
      .state('dashboard.my_videos', {
        url: '/videos',
        templateUrl: 'app/dashboard/my_videos/my_videos.html',
        controller: 'MyVideosController',
        controllerAs: 'vm'
      })
      .state('dashboard.upload', {
        url: '/upload',
        templateUrl: 'app/dashboard/upload/upload.html',
        controller: 'UploadController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
