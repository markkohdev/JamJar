
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
            template: "<div class='iconButton' ng-click='jjfs.toggleFullscreen()'><img ng-src='{{jjfs.icon()}}'/></div>",
            link: function(scope, elem, attrs, API) {
                scope.API = API;
            },
            scope: {
              'fullscreen': '=',
            },
            controller: JamJarFullscreenController,
            controllerAs: 'jjfs',
            bindToController: true
        }

        /** @ngInject */
        function JamJarFullscreenController($scope) {
            var vm = this;

            vm.isFullscreen = function() {
              return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
            }

            vm.icon = function() {
              if (vm.isFullscreen()) {
                return '/assets/images/overlay_btns/fullscreen_off_25x25.png'
              } else {
                return '/assets/images/overlay_btns/fullscreen_on_25x25.png'
              }
            }

            vm.toggleFullscreen = function() {
              var elem = $(".now-playing-video")[0];

              if (!document.fullscreenElement &&    // alternative standard method
                  !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
                if (elem.requestFullscreen) {
                  elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                  elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                  elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                  document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
              } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
                }
              }
            }

            $scope.$watch(vm.isFullscreen, function (newVal, oldVal) {
              if (newVal != oldVal) {
                vm.fullscreen.isFullscreen = newVal;
              }
            });
        }

        return directive;
    }
})();
