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
      'uploaders'   : $stateParams.uploaders
    };

    vm.genrename = '';
    vm.videos = [];
    vm.concerts = [];

    VideoService.getVideos(vm.query, function(err, resp) {
      vm.videos = resp;
      vm.concerts = _.uniqBy(_.map(resp, 'concert'), 'id');
    });
    
    GenreService.list(function(err, resp) {
        vm.genrename = _.find(resp, {id: parseInt($stateParams.genres)}).name;
    });
  }

})();
