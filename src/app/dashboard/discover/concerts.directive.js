(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('concerts', concerts);

  /** @ngInject */
  function concerts() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/discover/concerts.html',
      controller: ConcertsController,
      controllerAs: 'concerts',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ConcertsController(AuthService, $state) {
        var vm = this;

        vm.concerts = _.range(1, 5);
    }
  }

})();
