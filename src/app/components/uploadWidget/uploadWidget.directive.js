(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('uploadWidget', uploadWidget);

    /** @ngInject */    
    function uploadWidget() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/uploadWidget/uploadWidget.html',
            controller: uploadController,
            controllerAs: 'upload',
            bindToController: true
        };
        
        return directive;

        /** @ngInject */ 
        function uploadController(FileUploader, $scope) {
            $scope.privacySettings = ('Public Private').split(' ').map(function(ps) {
                return {value: ps};
            })
            
            var vm = this;
            
            /*
            var videoFile = '';
            videoFile.filename = '';
            videoFile.title = '';
            videoFile.description = '';
            videoFile.tags = '';
            videoFile.privacy = '';
            videoFile.concertName = '';
            videoFile.artist = '';
            videoFile.song = '';
            videoFile.venue = '';
            videoFile.concertDate = '1/18/2016';
            videoFile.isChanged = false;
            */
            
            vm.uploadSettings = {
                //url: 'upload.php',
                removeAfterUpload: true
            };
            
            vm.uploader = new FileUploader(vm.uploadSettings);

            vm.pause = function(doc) {
                    
            };
            
            vm.cancel = function(doc) {
                
            };

            vm.save = function(doc) {
                doc.filename = doc.newFilename;
                doc.isChanged = false;
            };

            vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccess', fileItem, response, status, headers);
                vm.documents.unshift(response);
            };
            vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onError', fileItem, response, status, headers);
            };
            vm.uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancel', fileItem, response, status, headers);
            };
            vm.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onComplete', fileItem, response, status, headers);
            };
        }
    }
})();
