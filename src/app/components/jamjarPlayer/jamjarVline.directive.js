
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarVline', jamjarVLine)

    /** @ngInject */
    function jamjarVLine () {
        var directive = {
            restrict: "E",
            require: "^videogular",
            templateUrl: 'app/components/jamjarPlayer/jamjarVLine.html',
            link: function(scope, elem, attrs, API) {
                scope.API = API;
            },
            scope: {
              'overlay': '=',
            },
            controller: JamJarVLineController,
            controllerAs: 'vline',
            bindToController: true
        }

        /** @ngInject */
        function JamJarVLineController(ConcertService) {
            var vm = this;

            vm.offset = function() {
              var screen_width = $('.jamjar-player').width() - 50; // TODO : don't hardcode this!!
              var relOffset = (vm.overlay.line.offset / vm.overlay.maxOffset) * screen_width;
              return relOffset;
            }
        }

        return directive;
    }
})();

