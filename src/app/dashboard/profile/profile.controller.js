(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyProfileController', MyProfileController);
    
    /** @ngInject */
    function MyProfileController($state, UserService, AuthService) {
        var vm = this;

        vm.profile = {};

        vm.pages = [
            {
              state: 'dashboard.profile.videos',
              name: 'Videos'
            },
            {
              state: 'dashboard.profile.concerts',
              name: 'Concerts'
            }
        ];

        vm.page = vm.pages[0].name;

        vm.switchTo = function(page) {
          vm.page = page.name;
          $state.go(page.state, {profile: vm.profile});
        };


        var user = AuthService.getUser();

        UserService.getProfile(user.username, function(err, resp) {
          if (err) return console.error(err);

          _.assign(vm.profile, resp);
        });
    }
})();
