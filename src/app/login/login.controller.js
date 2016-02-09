(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController() {
    var vm = this;

    vm.test = "Weeee!!!";

  }
    
/*    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
 
        vm.login = login;
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }*/
    /*
    $(window, document, undefined).ready(function() {

        $('input').blur(function() {
            var $this = $(this);
            if ($this.val())
              $this.addClass('used');
            else
              $this.removeClass('used');
        });

    });*/
})();
