(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('FallfestController', FallfestController);

  /** @ngInject */
  function FallfestController() {
    var vm = this;

    vm.test = "Test";

  }
})();
