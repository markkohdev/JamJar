(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('myVideos', myVideos);

  /** @ngInject */
  function myVideos() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/dashboard/profile/videos.html',
      controller: MyVideosController,
      controllerAs: 'vm',
      scope: {
        profile: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MyVideosController() {
      var vm = this;
    }
  }

})();
