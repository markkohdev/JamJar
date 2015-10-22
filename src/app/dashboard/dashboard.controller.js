(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController() {
    var vm = this;

    vm.test = "Dashboard!";

  }
})();
