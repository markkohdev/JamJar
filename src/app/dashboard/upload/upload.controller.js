(function() {
  'use strict';

  angular
    .module('jamjar')
    .controller('UploadController', UploadController);

  /** @ngInject */
  function UploadController() {
    var vm = this;

    vm.test = "uploading";

    vm.jawn = "Test";

  }
})();
