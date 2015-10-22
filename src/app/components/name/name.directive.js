(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('name', name);

  /** @ngInject */
  function name() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/name/name.html',
      controller: NameController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        name: '@'
      }
    };

    return directive;

    /** @ngInject */
    function NameController() {
      var vm = this;

      vm.name = '';
    }
  }

})();
