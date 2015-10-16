(function() {
  'use strict';

  angular
    .module('jamjar2')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.test = "Test";

  }
})();
