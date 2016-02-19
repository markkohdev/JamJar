(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('userAuthentication', userAuthentication);

  /** @ngInject */
  function userAuthentication() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/userAuthentication/userAuthentication.html',
      controller: UserController,
      controllerAs: 'user',
      bindToController: true
    };

    /** @ngInject */
    function UserController(AuthService, $state) {
        var vm = this;

        vm.tab = 1;

        vm.authService = AuthService;
        vm.$state = $state;

        vm.errorMessage = null;

        var user = AuthService.getUser();
        var username = !!user ? user.username : '';

        vm.login = {
          username: username,
          password: ''
        };

        vm.signup = {
          username: '',
          password: '',
          confirm: '',
          email: '',
          first_name: '',
          last_name: ''
        };

        vm.isSet = function(checkTab){
            return vm.tab === checkTab;   
        };

        vm.setTab = function(activeTab){
            vm.tab = activeTab;
        };

        vm.setError = function(err) {
            vm.errorMessage = err.error;
        }

        vm.logIn = function(){
            vm.authService.logIn(vm.login, function(err, resp) {
                if (err) return vm.setError(err);

                vm.authService.setUser(resp.user);
                vm.$state.go('dashboard.discover');
            });
        };

        vm.signUp = function(){
            vm.authService.signUp(vm.signup, function(err, resp) {
                  if (err) return vm.setError(err);

                vm.authService.setUser(resp.user);
                vm.$state.go('dashboard.confirm');
            });
        };

        vm.resetPw = function(){

        };
      
        return vm;
    }

    return directive;

  }

})();
