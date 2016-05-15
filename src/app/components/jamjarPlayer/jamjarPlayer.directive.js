
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlayer', jamjarPlayer)


    /** @ngInject */
    function jamjarPlayer() {
        var directive = {
          restrict: 'E',
          templateUrl: 'app/components/jamjarPlayer/jamjarPlayer.html',
          controller: JamJarPlayerController,
          controllerAs: 'player',
          bindToController: true
        };

        /** @ngInject */
        function JamJarPlayerController(ConcertService, VideoService, $sce, $stateParams, $state, $mdDialog, $mdMedia, $timeout) {
            var vm = this;

            /*vm.tooltip = {
                showTooltip : false,
                tipDirection : 'bottom'
            };*/

            vm.overlay = {
              visible: false,
              timeout: null,
              mouse: {pageX: 0, pageY: 0},
              state: null,
              maxOffset: 1,
              line: {offset: 0}
            };


            // this will be a factory with DI
            vm.jamjar = new JamJar(ConcertService, VideoService, $sce);
            vm.jamjar.initialize(parseInt($stateParams.concert_id), parseInt($stateParams.video_id), $stateParams.type, vm.overlay);

            vm.individual = $stateParams.type == 'individual';

            vm.jamjar.onPlay = function(video) {
              video.views += 1;
              VideoService.view(video.id, function(err, resp) {
                console.log(err, resp);
              });
            }

            window.jamjar = vm.jamjar;

            vm.onHover = function(event) {

              if (vm.overlay.state != 'auto')
                return

              // make overlay visible
              var timeoutMs = 2000;

              if (event.pageX == vm.overlay.mouse.pageX && event.pageY == vm.overlay.mouse.pageY) {
                return;
              } else {
                vm.overlay.mouse.pageX = event.pageX;
                vm.overlay.mouse.pageY = event.pageY;
              }

              vm.overlay.visible = true;

              // set timeout to make it invisible
              var timeout = $timeout(function() {
                vm.overlay.visible = false;
                vm.overlay.timeout = null;
              }, timeoutMs);

              // if timeout already exists
              // delete it and create a new one
              if (vm.overlay.timeout) {
                $timeout.cancel(vm.overlay.timeout);
              }
              vm.overlay.timeout = timeout;
            }

            vm.toggleOverlay = function(state) {
              if (state == 'off') {
                vm.overlay.visible = false;
                vm.overlay.state = null;
              } else if (state == 'on') {
                vm.overlay.state = null;
                vm.overlay.visible = true;
                if (vm.overlay.timeout) {
                  $timeout.cancel(vm.overlay.timeout);
                }
              } else if (state == 'auto') {
                vm.overlay.visible = true;
                vm.overlay.state = 'auto';
              }
            };

        }

        return directive;
    }
})();
