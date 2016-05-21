(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('SupportController', SupportController);

    /** @ngInject */
    function SupportController($scope, $state, TokenService, AuthService, ContactService) {
        var vm = this;
        
        vm.contactData = {
            email: "",
            name: "",
            relevant_url: "",
            feedback: ""
        };
        
        vm.isValid = false;
        vm.msgSent = false;        
        vm.showDashboardNav = false;
        
        if (TokenService.getToken() && AuthService.getUser()) {
            vm.showDashboardNav = true;
        }
        
        vm.submitMsg = function() {
            if(vm.contactData.email != "" && vm.contactData.name != "" && vm.contactData.feedback != "") {            
                vm.msgSent = true;
                ContactService.sendFeedback(vm.contactData, function(err, resp) {
                    if (err) {
                      debugger
                      return;
                    }

                    console.log(resp);
                    vm.msgSent = true;
                });   
            }
        }
    }
})();
