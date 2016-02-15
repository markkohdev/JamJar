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
    function JampicksController(AuthService, $state) {
        var vm = this;

        vm.videos = _.range(8);
    }
  }

})();
