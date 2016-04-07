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
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function UserController(AuthService, $state, $mdDialog, $mdMedia, $window) {
        var vm = this;
        vm.tab = 1;
        vm.authService = AuthService;
        vm.$state = $state;
        vm.errorMessage = null;
        vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var user = AuthService.getUser();
        var username = !!user ? user.username : '';

        vm.login = {
            username: username,
            password: ''
        };

        vm.isSet = function(checkTab){
            return vm.tab === checkTab;   
        };

        vm.setTab = function(activeTab){
            vm.tab = activeTab;
            vm.errorMessage = null;
        };

        vm.setError = function(err) {
            vm.errorMessage = err.error;
        }

        vm.logIn = function(){
            vm.authService.logIn(vm.login, function(err, resp) {
                if (err) 
                    return vm.setError(err);

                vm.authService.setUser(resp.user);
                vm.$state.go('dashboard.discover');
            });
        };
        
        vm.showSignUp = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
            
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/components/userAuthentication/signup.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                
            }, function() {
                
            });
            
            vm.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                vm.customFullscreen = (wantsFullScreen === true);
            });
        };

        vm.resetPw = function(){

        };
      
        return vm;
    }
      
    function DialogController(AuthService, $scope, $mdDialog, $window) {
        var vm = $scope;
        vm.authService = AuthService;
        vm.emailSent = false;
        vm.isDisabled = false;
        
        var user = AuthService.getUser();
        
        vm.signup = {
            first_name: '',
            last_name: '',
            email: '',
            username: '',
            password: '',
            confirm: ''
        };
        
        vm.hide = function() {
            $mdDialog.hide();
        };
        
        vm.cancel = function() {
            $mdDialog.cancel();
        };
        
        vm.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        
        vm.signUp = function(){
            vm.authService.signUp(vm.signup, function(err, resp) {
                if (err) {
                    return vm.setError(err);
                }
                
                vm.emailSent = true;
                vm.isDisabled = true;
                vm.authService.setUser(resp.user);
                //vm.$state.go('dashboard.confirm');
            });
        };
    }

    return directive;
  }

})();
