(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController() {
      var vm = this;
      
      vm.isCollapsed = false;
        
      vm.pages = [
        {
          state: 'home',
          name: 'Home'
        },
        {
          state: 'dashboard.home',
          name: 'Dashboard'
        },
        {
          state: 'dashboard.videos',
          name: 'Concerts'
        }
      ];
    }
  }

})();
