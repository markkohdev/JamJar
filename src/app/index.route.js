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
      .state('dashboard.home', {
        url: '/home',
        templateUrl: 'app/dashboard/home.html',
        controller: 'HomeController',
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
      .state('upload', {
        url: '/upload',
        templateUrl: 'app/upload/upload.html',
        controller: 'jamjarUpload',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
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
