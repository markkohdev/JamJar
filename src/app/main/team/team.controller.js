(function() {
    'use strict';

    angular
        .module('jamjar')
        .controller('TeamController', TeamController);

    /** @ngInject */
    function TeamController($scope, $state, $sce, TokenService, AuthService) {
        var vm = this;
        
        vm.showDashboardNav = false;
        
        if (TokenService.getToken() && AuthService.getUser()) {
            vm.showDashboardNav = true;
        }

        vm.config = {
            preload: "none",
            sources: [
                {src: $sce.trustAsResourceUrl("projectjamjar.com/assets/videos/team.mp4"), type: "video/mp4"}
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            }
        };
        
        var jamjarDesc = document.getElementById("jamjar-desc");
        
        var drew = document.getElementById("drew-container");
        var drewDesc = document.getElementById("drew-desc");
        
        var jess = document.getElementById("jess-container");
        var jessDesc = document.getElementById("jess-desc");
        
        var mark = document.getElementById("mark-container");
        var markDesc = document.getElementById("mark-desc");
        
        var sanjana = document.getElementById("sanjana-container");
        var sanjanaDesc = document.getElementById("sanjana-desc");
        
        var ethan = document.getElementById("ethan-container");
        var ethanDesc = document.getElementById("ethan-desc");
        
        drew.addEventListener("mouseenter", function(event){
            drew.style.background = "url(../../assets/images/team/drew.gif) 0 0 repeat";
            drewDesc.style.display = "block";
            jamjarDesc.style.display = "none";
            
            jess.style.background = "url(../../assets/images/team/jess-left.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-left.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        drew.addEventListener("mouseleave", function(event){
            drewDesc.style.display = "none";
            jamjarDesc.style.display = "block";
            
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
        
        jess.addEventListener("mouseenter", function(event){
            jess.style.background = "url(../../assets/images/team/jess.gif) 0 0 repeat";
            jessDesc.style.display = "block";
            jamjarDesc.style.display = "none";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-left.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        jess.addEventListener("mouseleave", function(event){
            jessDesc.style.display = "none";
            jamjarDesc.style.display = "block";
            
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        mark.addEventListener("mouseenter", function(event){
            mark.style.background = "url(../../assets/images/team/mark.gif) 0 0 repeat";
            markDesc.style.display = "block";
            jamjarDesc.style.display = "none";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-left.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        mark.addEventListener("mouseleave", function(event){
            markDesc.style.display = "none";
            jamjarDesc.style.display = "block";
            
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        sanjana.addEventListener("mouseenter", function(event){
            sanjana.style.background = "url(../../assets/images/team/sanjana.gif) 0 0 repeat";
            sanjanaDesc.style.display = "block";
            jamjarDesc.style.display = "none";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-right.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-left.png) 0 0 repeat";
        });
        sanjana.addEventListener("mouseleave", function(event){
            sanjanaDesc.style.display = "none";
            jamjarDesc.style.display = "block";
            
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
                
        ethan.addEventListener("mouseenter", function(event){
            ethan.style.background = "url(../../assets/images/team/ethan.gif) 0 0 repeat";
            ethanDesc.style.display = "block";
            jamjarDesc.style.display = "none";
            
            drew.style.background = "url(../../assets/images/team/drew-right.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-right.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-right.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-right.png) 0 0 repeat";
        });
        ethan.addEventListener("mouseleave", function(event){
            ethanDesc.style.display = "none";
            jamjarDesc.style.display = "block";
            
            drew.style.background = "url(../../assets/images/team/drew-front.png) 0 0 repeat";
            jess.style.background = "url(../../assets/images/team/jess-front.png) 0 0 repeat";
            mark.style.background = "url(../../assets/images/team/mark-front.png) 0 0 repeat";
            sanjana.style.background = "url(../../assets/images/team/sanjana-front.png) 0 0 repeat";
            ethan.style.background = "url(../../assets/images/team/ethan-front.png) 0 0 repeat";
        });
    }
})();
