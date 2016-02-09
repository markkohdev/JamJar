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
    function UserController(AuthService) {
        var vm = this;

        vm.tab = 1;
        vm.authService = AuthService;

        vm.errorMessage = null;

        vm.login = {
          username: '',
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
            alert(err.error);
        }

        vm.logIn = function(){
            vm.authService.logIn(vm.login, function(err, resp) {
                if (err) return vm.setError(err);

                debugger
            });
        };

        vm.signUp = function(){
            vm.authService.signUp(vm.signup, function(err, resp) {
                  if (err) return vm.setError(err);

                  debugger
            });
        };

        vm.resetPw = function(){

        };
      
        return vm;
    }
  }

})();
