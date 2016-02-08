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
    function UserController() {
        var vm = this;
        
        vm.tab = 1;
        
        vm.email = '';
        vm.password = '';
        
        vm.name = '';
        vm.newEmail = '';
        vm.newPassword = '';
        
        vm.isSet = function(checkTab){
            return vm.tab === checkTab;   
        };
        
        vm.setTab = function(activeTab){
            vm.tab = activeTab;   
        };
        
        vm.logIn = function(){
            
        };
        
        vm.signUp = function(){
            
        };
        
        vm.resetPw = function(){
            
        };
    }

    return directive;

  }

})();
