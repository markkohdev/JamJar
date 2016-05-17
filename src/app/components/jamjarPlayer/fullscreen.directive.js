
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarFullscreen', jamjarFullscreen)

    /** @ngInject */
    function jamjarFullscreen () {
        var directive = {
            restrict: "E",
            require: "^videogular",
            template: "<div class='iconButton' ng-click='void(0)'><img ng-src='/assets/images/overlay_btns/jamjar_auto_25x25.png'/></div>",
            link: function(scope, elem, attrs, API) {
                scope.API = API;
            },
            scope: {
              'toggleOverlay': '=',
              'jamjarButton': '=',
            },
            controller: JamJarFullscreenController,
            controllerAs: 'jjfs',
            bindToController: true
        }

        /** @ngInject */
        function JamJarFullscreenController(ConcertService) {
            var vm = this;
        }

        return directive;
    }
})();
