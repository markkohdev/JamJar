(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarPlugin', jamjarPlugin);

    /** @ngInject */
    function jamjarPlugin(VG_STATES) {
        var directive = {
            restrict: "E",
            require: "^videogular",
            templateUrl: 'app/components/jamjarPlayer/jamjarOverlay.tmpl.html',
            link: function(scope, elem, attrs, API) {
                scope.API = API;
            },
            controller: JamJarPluginController,
            controllerAs: 'jjp',
            bindToController: true
        }

        /** @ngInject */
        function JamJarPluginController() {
            var vm = this;
        }

        return directive;
    }
})();
