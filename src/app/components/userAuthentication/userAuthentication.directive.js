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
    function UserController(AuthService, $state, $scope, $mdDialog, $mdMedia, $window, $log) {
        var vm = this;
        vm.tab = 1;
        vm.authService = AuthService;
        vm.$state = $state;
        vm.errorMessage = null;
        
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

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
            $scope.$log = $log;
            $scope.message = 'Hello World!';
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

        vm.showPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                  .title('What would you name your dog?')
                  .textContent('Bowser is a common name.')
                  .placeholder('dog name')
                  .ariaLabel('Dog name')
                  .targetEvent(ev)
                  .ok('Okay!')
                  .cancel('I\'m a cat person');
            $mdDialog.show(confirm).then(function(result) {
                  $scope.status = 'You decided to name your dog ' + result + '.';
            }, function() {
                  $scope.status = 'You didn\'t name your dog.';
            });
        };
        
          $scope.openDialog = function(){
            $mdDialog.show({
              controller: function($scope, $mdDialog){
                // do something with dialog scope
              },
              template: '<md-dialog aria-label="My Dialog">'+
                            '<md-dialog-content class="sticky-container">Blah Blah' +
                            '</md-dialog-content>' +
                            '<md-button ng-click=close()>Close</md-button>' +
                            '</md-dialog>',
              targetEvent: event
            });
          };
        
        vm.signUp = function(){
            vm.authService.signUp(vm.signup, function(err, resp) {
                if (err) 
                    return vm.setError(err);

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
