
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
            template: "<div class='iconButton' ng-click='jjb.click()'><img ng-src='{{jjb.icon}}'/></div>",
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

            var icon_map = {
              "auto" : "jamjar_auto_25x25.png",
              "off": "jamjar_off_25x25.png",
              "on": "jamjar_on_25x25.png"
            }

            var base_path = "/assets/images/overlay_btns"
            var states = ["auto", "off", "on"];
            var stateIndex = 2; // 0

            vm.click = function() {
              stateIndex = (stateIndex + 1) % states.length;

              var state = states[stateIndex];
              vm.icon = base_path + "/" + icon_map[state];

              vm.toggleOverlay(state);
            }

            var initialState = states[stateIndex];
            vm.icon = base_path + "/" + icon_map[initialState];
            vm.toggleOverlay(initialState); // inform overlay of what the initial state is!
        }

        return directive;
    }
})();
