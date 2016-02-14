(function() {
  'use strict';

  angular
    .module('jamjar')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('confirm', {
        url: '/auth/confirm',
        templateUrl: 'app/auth/confirm.html',
        controller: 'SignupConfirmController',
        controllerAs: 'controller'
      })
      .state('activate', {
        url: '/auth/activate/',
        templateUrl: 'app/auth/activate.html',
        controller: 'SignupActivateController',
        controllerAs: 'controller'
      })
      //.state('dashboard', {
      //  url: '/dashboard',
      //  abstract: true,
      //  templateUrl: 'app/dashboard/dashboard.html',
      //  controller: 'DashboardController',
      //  controllerAs: 'vm'
      //})
      //.state('dashboard.home', {
      //  url: '/home',
      //  templateUrl: 'app/dashboard/home.html',
      //  controller: 'HomeController',
      //  controllerAs: 'controller'
      //})
      //.state('dashboard.videos', {
      //  url: '/videos',
      //  templateUrl: 'app/dashboard/videos.html',
      //  controller: 'VideosController',
      //  controllerAs: 'vm'
      //})
      //.state('dashboard.uploader', {
      //  url: '/uploader',
      //  templateUrl: 'app/dashboard/uploader.html',
      //  controller: 'UploaderController',
      //  controllerAs: 'vm'
      //})
      .state('discover', {
        url: '/discover',
        templateUrl: 'app/discover/discover.html',
        controller: 'DiscoverController',
        controllerAs: 'vm'
      })
      .state('upload', {
        url: '/upload',
        templateUrl: 'app/upload/upload.html',
        controller: 'jamjarUpload',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
