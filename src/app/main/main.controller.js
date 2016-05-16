(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('MainController', MainController)
        .controller('VideoController', VideoController);

    /** @ngInject */
    
    function MainController($anchorScroll, $location, $scope, $state, $window, $document, TokenService, AuthService) {
        var vmMain = this;
        
        // if a 401 Unauthorized response is returned, then the token and user are 
        // cleared from local storage. This ensures that the user won't fall into an
        // infinite loop! If they are already authed, just redirect to discover
        if (TokenService.getToken() && AuthService.getUser()) {
          return $state.go('dashboard.discover');
        }
        
        vmMain.doStickToTop = false;
        vmMain.winHeight = $window.innerHeight - 85; //minus height+padding of authentication navbar
        vmMain.navTop = vmMain.winHeight;
        
        $document.on('scroll', function() {
            if ($window.scrollY > vmMain.navTop) {
                vmMain.doStickToTop = true;
            }
            else {
                vmMain.doStickToTop = false;
            }
            
            $scope.$digest(); //$scope.$apply();
        });

        /*$scope.gotoExplore = function(){
            if($location.hash() !== 'explore') {
                $location.hash('explore');   
            }
            else {
                $anchorScroll();   
            }
        };*/
    }
    
    function VideoController($sce, $timeout) {
        var vm = this;
        
        vm.state = null;
        vm.API = null;
        vm.currentVideo = 0;

        vm.onPlayerReady = function(API) {
            vm.API = API;
        };

        vm.onCompleteVideo = function() {
            vm.isCompleted = true;

            vm.currentVideo++;

            if (vm.currentVideo >= vm.videos.length) 
                vm.currentVideo = 0;

            vm.setVideo(vm.currentVideo);
        };
        
        vm.videos = [
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
                ]
            },            
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"), type: "video/mp4"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
                ]
            }
        ];
            
        vm.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: vm.videos[0].sources,
            theme: "bower_components/videogular-themes-default/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };
        
        vm.setVideo = function(index) {
            vm.API.stop();
            vm.currentVideo = index;
            vm.config.sources = vm.videos[index].sources;
            $timeout(vm.API.play.bind(vm.API), 100);
        };
    }
})();
