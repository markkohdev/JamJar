
(function() {
  'use strict';

  angular
    .module('jamjar')
    .directive('jamjarVote', jamjarVote)

    /** @ngInject */
    function jamjarVote () {
        var directive = {
            restrict: "E",
            scope: {
              'jamjar': '=',
            },
            templateUrl: 'app/components/jamjarPlayer/jamjarVote.html',
            controller: JamJarVoteController,
            controllerAs: 'votes',
            bindToController: true
        }

        /** @ngInject */
        function JamJarVoteController(VideoService) {
            var vm = this;

            vm.vote = function(voteType) {
              if (!vm.jamjar.nowPlaying) return;

              var votes = vm.jamjar.nowPlaying.video.votes;
              var vote = _.find(votes.video_votes, {'vote': voteType});

              if (!vote) {
                vote = {vote: voteType, total: 0}
                votes.video_votes.push(vote);
              }

              var voteDelta = 1;

              if (voteType === votes.user_vote) {
                voteType = null;
                voteDelta = -1;
              } else if (voteType !== votes.user_vote && votes.user_vote !== null) {
                // if it's the opposite of before, then subtract from before vote total
                var oldVote = _.find(votes.video_votes, function(vote) { return vote['vote'] !== voteType });
                if (oldVote)
                  oldVote.total -= 1;
              }

              vote.total += voteDelta;
              votes.user_vote = voteType;

              // then send vote to API
              var video_id = vm.jamjar.nowPlaying.video.id;
              VideoService.vote(video_id, voteType, function(err, resp) {
                console.log(err, resp);
              });
            }

            vm.getVotes = function(voteType) {
              if (!vm.jamjar.nowPlaying) return;

              var votes = vm.jamjar.nowPlaying.video.votes.video_votes;
              var vote = _.find(votes, {'vote': voteType});
              return _.get(vote, 'total', 0);
            }

            vm.userVote = function(voteType) {
              if (!vm.jamjar.nowPlaying) return;

              var vote = vm.jamjar.nowPlaying.video.votes.user_vote;
              return vote == voteType;
            }

            vm.showFlagForm = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
                var video_id = _.get(vm.jamjar, 'nowPlaying.video.id', null);
                
                $mdDialog.show({
                    locals: {video_id: video_id},
                    controller: FlagDialogController,
                    templateUrl: 'app/components/jamjarPlayer/flag.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                });
            };

        }

        return directive;
    }

  /** @ngInject */
  function FlagDialogController($scope, $mdDialog, VideoService, video_id) {
      var vm = $scope;

      vm.flagTypes = [{value: 'A', text: 'Accuracy'}, {value: 'I', text: 'Inappropriate'}, {value: 'Q', text: 'Quality'}];
      
      vm.flag = {
          video: video_id,
          flag_type: '',
          notes: ''
      };
      
      vm.hide = function() {
          $mdDialog.hide();
      };
      
      vm.cancel = function() {
          $mdDialog.cancel();
      };
      
      vm.submitReport = function(){
          VideoService.submitFlag(vm.flag, function(err, resp) {
            vm.flagSent = true;
          });
      };
  }
})();

