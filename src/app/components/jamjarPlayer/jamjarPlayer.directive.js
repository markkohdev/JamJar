(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlayer', jamjarPlayer);

  /** @ngInject */
  function jamjarPlayer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/jamjarPlayer/jamjarPlayer.html',
      controller: JamJarPlayerController,
      controllerAs: 'player',
      bindToController: true
    };

    /** @ngInject */
    function JamJarPlayerController(ConcertService, $sce, $stateParams, $state) {
      var vm = this;

      vm.$stateParams = $stateParams;

      // this will be a factory with DI
      vm.jamjar = new JamJar(ConcertService, $sce);
      vm.jamjar.initialize(parseInt(vm.$stateParams.concert_id), parseInt(vm.$stateParams.video_id));
    }

    return directive;

  }

})();

