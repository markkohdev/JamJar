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
      .state('dashboard.concert', {
        url: '/concert/:id',
        templateUrl: 'app/dashboard/concert/concert.html',
        controller: 'ConcertController',
        controllerAs: 'vm'
      })
      .state('dashboard.player', {
        url: '/player/:type/:concert_id?:video_id',
        templateUrl: 'app/dashboard/player/player.html',
        controller: 'JamJarPlayerController',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .state('dashboard.upload', {
        url: '/upload',
        templateUrl: 'app/dashboard/upload/upload.html',
        controller: 'UploadController',
        controllerAs: 'vm'
      })
      .state('dashboard.my_videos', {
        url: '/myvideos',
        templateUrl: 'app/dashboard/my_videos/my_videos.html',
        controller: 'MyVideosController',
        controllerAs: 'vm'
      })
      .state('dashboard.my_concerts', {
        url: '/myconcerts',
        templateUrl: 'app/dashboard/my_videos/my_concerts.html',
        controller: 'MyConcertsController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
