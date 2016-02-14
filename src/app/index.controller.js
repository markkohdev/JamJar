(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('IndexController', IndexController);
    
  /** @ngInject */
  function IndexController($location) {
    var vm = this;

    vm.isHome = function() {
      return $location.path() == '/';
    }
  }

})();
