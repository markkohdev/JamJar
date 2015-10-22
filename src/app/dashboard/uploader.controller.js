(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('UploaderController', UploaderController);

  /** @ngInject */
  function UploaderController() {
    var vm = this;

    vm.test = "uploading";

    vm.jawn = "Test";

  }
})();
