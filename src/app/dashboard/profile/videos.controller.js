(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('MyVideosController', MyVideosController);
    
    /** @ngInject */
    function MyVideosController($stateParams, $scope, $state) {
        var vm = this;

        vm.videos = [];

        vm.videoArtist = function(video) {
          return _.map(video.artists, 'name').join(", ");
        };

        $scope.$watch(function() { return $stateParams.profile },
            function (newVal, oldVal) {
              console.log(oldVal, newVal);
            });

    }
})();
