(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('SignupActivateController', SignupActivateController);

  /** @ngInject */
  function SignupActivateController(AuthService, APIService, $state, $location) {
    var vm = this;

    vm.apiService = APIService;
    vm.authService = AuthService;

    vm.status = "Activating your account...";

    var doActivate = function() {
      var params = $location.search();
      var data = {email: params.email, activation_key: params.activation_key};

      vm.authService.activate(data, function(err, resp) {
        if (err) {
          vm.status = "There was a problem activating your account";
        } else {
          vm.status = "Activated!";
          $state.go('home');
        }
      });
    };

    doActivate();
  }

})();
