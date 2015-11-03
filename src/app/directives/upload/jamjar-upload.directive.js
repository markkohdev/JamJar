(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarUpload', jamjarUpload);

  /** @ngInject */
  function jamjarUpload() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/directives/upload/jamjar-upload.html',
      controller: jamjarUploadController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function jamjarUploadController(FileUploader, $http) {
      var vm = this;

      var uploadSettings = {
        url: 'http://api.localhost.dev:5001/videos/',
        removeAfterUpload: true,
        formData: [
          {
            'name': 'test'
          }
        ]
      };

      vm.uploader = new FileUploader(uploadSettings);

    }
  }

})();
