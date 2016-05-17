(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('AboutController', AboutController);

    /** @ngInject */
    function AboutController($scope, $state, TokenService, AuthService) {
        var vm = this;
        
        vm.showDashboardNav = false;
        
        if (TokenService.getToken() && AuthService.getUser()) {
            vm.showDashboardNav = true;
        }
    }
})();
