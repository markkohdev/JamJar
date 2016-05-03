(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('ExploreController', ExploreController);

  /** @ngInject */
  function ExploreController($stateParams, VideoService, GenreService) {
    var vm = this;

    vm.query = {
      'genres'  : $stateParams.genres,
      'artists' : $stateParams.artists,
      'uploaders'   : $stateParams.uploaders,
      'venues'   : $stateParams.venues
    };

    vm.videos = [];
    vm.concerts = [];

    vm.name = $stateParams.name;

    VideoService.getVideos(vm.query, function(err, resp) {
      vm.videos = resp;
      vm.concerts = _.uniqBy(_.map(resp, 'concert'), 'id');
    });
  }

})();
