(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyConcertsController', MyConcertsController);
    
    /** @ngInject */
    function MyConcertsController($stateParams) {
        var vm = this;

        vm.profile = $stateParams.profile;
        vm.concerts = vm.profile.concerts;
    }
})();
