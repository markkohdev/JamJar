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
        
        $document.on('scroll', function() {
            if ($window.scrollY > vmMain.winHeight) {
                vmMain.doStickToTop = true;
            }
            else {
                vmMain.doStickToTop = false;
            }
            
            $scope.$digest(); //$scope.$apply();
        });
        
        angular.element($window).bind('resize', function(){
            vmMain.winHeight = $window.innerHeight - 85;
             
            $scope.$digest();
        });
        
        // Selena's JamJar
        vmMain.landing = {
            concertId: 10,
            videoId: 46,
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
