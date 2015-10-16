(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.test = "Test";

  }
})();
