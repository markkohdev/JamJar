(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('genres', genres);

  /** @ngInject */
  function genres() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/discover/genres.html',
      controller: GenresController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function GenresController(GenreService) {
      var vm = this;

      vm.genres = [];
      vm.colors = ["#F5A95F", "#FDEB65", "#9BD096", "#7976B4", "#673A96"];

      // thanks, stackoverflow!
      function shadeColor(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
      }

      vm.getGenreStyles = function(index) {
        var backgroundColor = vm.colors[index % vm.colors.length];
        var borderColor = shadeColor(backgroundColor, -0.2); // make this 20% darker

        return {
          'background-color': backgroundColor,
          'border-color': borderColor,
          'border-width': '4px',
          'border-style': 'solid'
        }

      };

      GenreService.list(function(err, resp) {
        if (err) {
          return console.error(err);
        }

        vm.genres = resp;
        console.log(resp);
      });
    }
  }

})();
