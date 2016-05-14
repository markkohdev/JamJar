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
//            {
//                state: 'settings.account',
//                name: 'Account',
//
//            },
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
        vm.selectedItem = null;

        vm.querySearch  = function(query) {
          var promise = SearchService.search(vm.searchText);
          return promise;
        }

        vm.searchResultClick = function() {
          if (!vm.selectedItem) return;

          var type = vm.selectedItem.type;

          if (type == 'user') {
            $state.go('dashboard.explore', {uploaders: vm.selectedItem.id, name: vm.selectedItem.name}, {inherit: false});
          } else if (type == 'video') {
            $state.go('dashboard.player', {concert_id: vm.selectedItem.concert_id, video_id: vm.selectedItem.id, type:'individual'});
          } else if (type == 'concert') {
            $state.go('dashboard.concert', {id: vm.selectedItem.id});
          } else if (type == 'artist') {
            $state.go('dashboard.explore', {artists: vm.selectedItem.id, name: vm.selectedItem.name}, {inherit: false});
          } else if (type == 'venue') {
            $state.go('dashboard.explore', {venues: vm.selectedItem.id, name: vm.selectedItem.name}, {inherit: false});
          } else {
            console.error("unsupported search type:", type);
          }
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
