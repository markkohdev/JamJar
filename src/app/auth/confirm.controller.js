(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('SignupConfirmController', SignupConfirmController);

  /** @ngInject */
  function SignupConfirmController(AuthService) {
    var vm = this;

    vm.authService = AuthService;
  }

})();
