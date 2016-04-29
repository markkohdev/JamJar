(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($stateParams, VideoService) {
    var vm = this;

    vm.query = {
      'genres'  : $stateParams.genres,
      'artists' : $stateParams.artists,
      'users'   : $stateParams.users
    };

    vm.videos = [];
    vm.concerts = [];

    VideoService.getVideos(vm.query, function(err, resp) {
      vm.videos = resp;
      vm.concerts = _.uniqBy(_.map(resp, 'concert'), 'id');
    });
  }

})();
