(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('replayPlugin', replayPlugin);

    /** @ngInject */
    function replayPlugin() {
        var directive = {
            restrict: "E",
            require: "^videogular",
            template: "<div ng-show=\"API.isCompleted && API.currentState == 'stop'\"><span ng-click=\"onClickReplay()\">REPLAY</span></div>",
            link: function(scope, elem, attrs, API) {
                scope.API = API;

                scope.onClickReplay = function() {
                    API.play();
                    //scope.restart();
                };
            }
//            scope: {
//              'restart': '=',
//            }
        }

        return directive;
    }
})();

//<md-icon md-svg-src=\"assets/images/btns/ic_replay_white_48px.svg\"></md-icon>