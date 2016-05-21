(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('JamJarPlayerController', JamJarPlayerController);

    /** @ngInject */
    function JamJarPlayerController(ConcertService, $state, AuthService, TokenService) {
        var vm = this;

        if (!AuthService.getUser()) {
           TokenService.onUnauthorized();
        }
    }
})();
