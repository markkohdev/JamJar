(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('SupportController', SupportController);

    /** @ngInject */
    function SupportController($scope, $state, TokenService, AuthService) {
        var vm = this;
        
        vm.showDashboardNav = false;
        
        if (TokenService.getToken() && AuthService.getUser()) {
            vm.showDashboardNav = true;
        }
    }
})();
