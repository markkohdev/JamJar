(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('TeamController', TeamController);

    /** @ngInject */
    function TeamController($scope, $state, TokenService, AuthService) {
        var vm = this;
        
        vm.showDashboardNav = false;
        
        if (TokenService.getToken() && AuthService.getUser()) {
            vm.showDashboardNav = true;
        }
        
        var drew = document.getElementById("drew-container");
        var jess = document.getElementById("jess-container");
        var mark = document.getElementById("mark-container");
        var sanjana = document.getElementById("sanjana-container");
        var ethan = document.getElementById("ethan-container");
        
        drew.addEventListener("mouseenter", function(event){
            drew.style.background = "url(../../assets/images/team/drew.gif) 0 0 repeat";
            
            jess.style.background = "url(../../assets/images/team/jess-left.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-left.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        drew.addEventListener("mouseleave", function(event){
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
        
        jess.addEventListener("mouseenter", function(event){
            jess.style.background = "url(../../assets/images/team/jess.gif) 0 0 repeat";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-left.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        jess.addEventListener("mouseleave", function(event){
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        mark.addEventListener("mouseenter", function(event){
            mark.style.background = "url(../../assets/images/team/mark.gif) 0 0 repeat";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        mark.addEventListener("mouseleave", function(event){
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        sanjana.addEventListener("mouseenter", function(event){
            sanjana.style.background = "url(../../assets/images/team/sanjana.gif) 0 0 repeat";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-right.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        sanjana.addEventListener("mouseleave", function(event){
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        ethan.addEventListener("mouseenter", function(event){
            ethan.style.background = "url(../../assets/images/team/ethan.gif) 0 0 repeat";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-right.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-right.png) 0 0 repeat";
        });
        ethan.addEventListener("mouseleave", function(event){
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
        
    var test = document.getElementById("test");
  
  
      // this handler will be executed only once when the cursor moves over the unordered list
      test.addEventListener("mouseenter", function( event ) {   
        // highlight the mouseenter target
        event.target.style.color = "purple";

        // reset the color after a short delay
        setTimeout(function() {
          event.target.style.color = "";
        }, 500);
      }, false);
    }
})();
