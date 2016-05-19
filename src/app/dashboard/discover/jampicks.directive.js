(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jampicks', jampicks);

  /** @ngInject */
  function jampicks() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/discover/jampicks.html',
      controller: JampicksController,
      controllerAs: 'jampicks',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function JampicksController(VideoService) {
        var vm = this;

        vm.videos = [];


        VideoService.listJampicks(function(err, resp) {
            if (err) {
              return console.error(err);
            }

            vm.videos = resp;
        });
    }
  }

})();
