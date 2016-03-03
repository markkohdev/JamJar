(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('subNavbar', subNavbar);

  /** @ngInject */
  function subNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/myVideosNavbar/subNavbar.html',
      controller: SubNavbarController,
      controllerAs: 'subNavbar',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SubNavbarController() {
        var vm = this;
        
        vm.pages = [
            {
              state: 'myvideos.all',
              name: 'All'
            },
            {
              state: 'myvideos.concerts',
              name: 'Concerts'
            },
            {
              state: 'myvideos.playlists',
              name: 'Playlists'
            }
        ];
    }
  }

})();