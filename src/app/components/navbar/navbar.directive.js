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
    function NavbarController($mdDialog, SearchService) {
        var vm = this;
      
        vm.isCollapsed = false;
        
        vm.pages = [
            {
              state: 'dashboard.discover',
              name: 'Discover'
            },
            {
              state: 'dashboard.my_videos',
              name: 'My Videos'
            },
            {
              state: 'dashboard.upload',
              name: 'Upload'
            }
        ];
        
        vm.settings = [
            {
                state: 'settings.account',
                name: 'Account'
            },
            {
                state: 'settings.logout',
                name: 'Log Out'
            }            
        ];

        vm.search = "";
        vm.doSearch = function() {
          console.log("Searching: ", vm.search);
          SearchService.search(vm.search, function(err, resp) {
            if (err) {
              debugger
              console.log(err);
            }

            console.log(resp);
          });
        };

        vm.allPages = vm.pages.concat(vm.settings);
        
        var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.announceClick = function(index) {
            $mdDialog.show(
                $mdDialog.alert()
                    .content('Logging out... ')
                    .ok('Cool')
                    .targetEvent(originatorEv)
            );
            originatorEv = null;
        };
    }
  }

})();
