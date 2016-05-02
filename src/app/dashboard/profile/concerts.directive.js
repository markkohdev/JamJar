(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('myConcerts', myConcerts);

  /** @ngInject */
  function myConcerts() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/profile/concerts.html',
      controller: MyConcertsController,
      controllerAs: 'vm',
      scope: {
        profile: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MyConcertsController() {
      var vm = this;
    }
  }

})();
