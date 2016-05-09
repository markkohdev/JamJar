
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarButton', jamjarButton)

    /** @ngInject */
    function jamjarButton () {
        var directive = {
            restrict: "E",
            require: "^videogular",
            template: "<div class='iconButton' ng-click='jjb.toggleOverlay()'><img ng-src='assets/images/overlay_btns/jamjar_auto_30x30.png'/></div>",
            link: function(scope, elem, attrs, API) {
                scope.API = API;
            },
            scope: {
              'toggleOverlay': '=',
            },
            controller: JamJarBtnController,
            controllerAs: 'jjb',
            bindToController: true
        }

        /** @ngInject */
        function JamJarBtnController(ConcertService) {
            var vm = this;
        }

        return directive;
    }
})();
