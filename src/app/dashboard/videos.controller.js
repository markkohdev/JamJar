(function() {
    'use strict';
    angular
        .module('jamjar')
        .controller('VideosController', VideosController);

    /** @ngInject */
    function VideosController($sce, $timeout) {
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
                    {src: $sce.trustAsResourceUrl("http://api.projectjamjar.com/videos/stream/1"), type: "video/mp4"}
                ]
            },
            {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://api.projectjamjar.com/videos/stream/2"), type: "video/mp4"}
                ]
            },
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
