(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyPlaylistsController', MyPlaylistsController);
    
    /** @ngInject */
    function MyPlaylistsController($sce, $timeout) {
        var vm = this;
        vm.videos = _.range(8);
    }
})();