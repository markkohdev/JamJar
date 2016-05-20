(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('MainController', MainController);

    /** @ngInject */
    
    function MainController($anchorScroll, $location, $scope, $state, $window, $document, TokenService, AuthService, VideoService) {
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
        

        vmMain.landing = {
            isLanding: true,
            concertId: 2,
            videoId: 13,
            type: "jamjar"
        };
        
//        VideoService.listJampicks(function(err, resp) {
//            if (err) {
//              return console.error(err);
//            }
//
//            console.log(resp);
//            debugger;
//            vmMain.landing.videoId = resp[0].id;  
//            vmMain.landing.concertId = resp[0].concert.id;
//        });
    }
})();
