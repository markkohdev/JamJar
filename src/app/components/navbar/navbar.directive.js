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
    function NavbarController($mdDialog, $state, TokenService, SearchService) {
        var vm = this;
      
        vm.isCollapsed = false;
        
        vm.pages = [
            {
              state: 'dashboard.discover',
              name: 'Discover'
            },
            {
              state: 'dashboard.profile.videos',
              name: 'Profile'
            },
            {
              state: 'dashboard.upload',
              name: 'Upload'
            }
        ];
        
        vm.settings = [
            {
                state: 'settings.account',
                name: 'Account',

            },
            {
                name: 'Log Out',
                onClick: function() {
                  TokenService.clearToken();
                  $state.go('landing');
                }
            }
        ];

        vm.handleClick = function(item) {
          if (item.state) {
            $state.go(item.state);
          } else if (item.onClick) {
            item.onClick();
          } else {
            console.error('bad instruction for item: ', item);
          }
        };
        
        vm.searchText = "";

        vm.querySearch  = function(query) {
          var promise = SearchService.search(vm.searchText);
          return promise;
        }

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
