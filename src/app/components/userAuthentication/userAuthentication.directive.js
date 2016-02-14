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

    return directive;

    /** @ngInject */
    function UserController(AuthService, $location) {
        var vm = this;

        vm.tab = 1;

        vm.authService = AuthService;
        vm.$location   = $location;

        vm.errorMessage = null;

        var cookiedUser = AuthService.getUser().username;
        vm.login = {
          username: cookiedUser || '',
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
                vm.$location.path('/upload');
            });
        };

        vm.signUp = function(){
            vm.authService.signUp(vm.signup, function(err, resp) {
                  if (err) return vm.setError(err);

                vm.authService.setUser(resp.user);
                vm.$location.path('/auth/confirm');
            });
        };

        vm.resetPw = function(){

        };
      
        return vm;
    }
  }

})();
