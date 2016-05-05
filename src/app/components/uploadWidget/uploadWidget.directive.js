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
            bindToController: true,
            link: function(scope, element, attributes) {
              scope.videoDetails = scope.$eval(attributes.videoDetails);
            },
            scope: true
        };

        return directive;

        /** @ngInject */ 
        function uploadController(FileUploader, $scope, APIService, TokenService, ConcertService) {
            var vm = this;
            
            vm.showErrMsg = false;

            vm.privacySettings = [{value: 'Public'}, {value: 'Private'}];

            vm.valid = function() {
              var videoDetails = $scope.videoDetails();

              var validVenueInput = !!(videoDetails.venueString && videoDetails.venueString.length > 0);

              var validVenue = _.get(videoDetails, 'venue.place_id', false);
              
              var validDate = videoDetails.date;

              var hasArtists = videoDetails.artists.length > 0;
                
              var validArtists = _.every(videoDetails.artists, function(artist) {
                return !!artist.id;
              });

              var validFiles = _.every(vm.uploader.queue, function(item) {
                return item.title && item.title.length > 0 && item.privacy;
              });

              return hasArtists && validVenue && validDate && validArtists && validFiles && validVenueInput;
            };
            
            vm.uploader = new FileUploader({
                url: APIService.apiRootUrl + 'videos/',
                headers: {
                  Authorization: 'Token ' + TokenService.getToken()
                },
                //removeAfterUpload: true
            });
            
            vm.uploader.filters.push({
                name: 'videoFilter',
                fn: function(item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|mov|mpeg4|mp4|avi|wmv|mpegps|flv'.indexOf(type) !== -1;
                }
            });
            
            vm.uploader.onWhenAddingFileFailed = function(item, filter) {
                return alert('You can upload only .mov, .mpeg4, .mp4, .avi, .wmv, .mpegps, .flv files');
            };

            vm.uploader.onAfterAddingFile = function(item) {
              // Default privacy = public
              item.privacy = 'Public';

              // Default name = filename-extension
              var title = item.file.name;
              title = title.substring(0,title.lastIndexOf('.'));
              item.title = title;
            };

            vm.uploadStatus = function(item) {
              if (item.isError) {
                return "Error: " + item.file.error;
              } else if (item.isUploading) {
                return "Uploading";
              } else if (item.isUploaded) {
                return "Uploaded!";
              } else if (item.isReady) {
                return "Ready to upload";
              }
              return "Ready to upload";
            };

            vm.uploadAll = function(concert, artists) {
              _.each(vm.uploader.queue, function(item) {

                if(!item.isUploaded) {
                    // clear previous errors if any
                    item.file.error = null;

                    var is_private = (item.privacy == 'Private');
                    var videoInformation = [{name: item.title, concert: concert.id, is_private: is_private}];
                    // include multiple `artists` keys if multiple artists are given
                    var artistInformation = _.map(artists, function(artist) { return {artists: artist.id} });
                    item.formData = videoInformation.concat(artistInformation);

                    item.upload();
                }
              });
            };

            vm.doUpload = function() {
              if(!vm.valid()){
                  vm.showErrMsg = true;
                  return;
              }
                
              vm.showErrMsg = false;
                
              var videoDetails = $scope.videoDetails();

              var concertData = {
                venue_place_id: videoDetails.venue.place_id,
                date: moment(videoDetails.date).format('YYYY-MM-DD')
              }

              ConcertService.getOrCreateConcert(concertData, function(err, concert) {
                if (err) {
                  debugger
                  return;
                }

                vm.uploadAll(concert, videoDetails.artists);
              });
            };

            vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
              fileItem.file.uploaded = true;
              console.info('onSuccess', fileItem, response, status, headers);
            };
            vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
              fileItem.file.error = response.error;
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
