(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('VideosController', VideosController);

  /** @ngInject */
  function VideosController() {
    var vm = this;

    vm.test = "Weeee!!!";

  }
})();
