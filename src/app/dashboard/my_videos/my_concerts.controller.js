(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyConcertsController', MyConcertsController);
    
    /** @ngInject */
    function MyConcertsController($sce, $timeout) {
        var vm = this;
        vm.videos = _.range(8);
    }
})();