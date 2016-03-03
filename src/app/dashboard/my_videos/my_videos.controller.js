(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyVideosController', MyVideosController);
    
    /** @ngInject */
    function MyVideosController($sce, $timeout) {
        var vm = this;
        vm.videos = _.range(8);
    }
})();