'use strict';

angular.module('Player.first', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/first', { templateUrl: './views/firstView/firstView.html', controller: 'FirstViewCtrl' })
}])


.controller('FirstViewCtrl',['$scope','$location',
    function($scope,$location){
      $scope.sound = null;
      $scope.songPlaying=false,$scope.playListVisible = false;
      $scope.timer = "0.00",$scope.trackName = "";

      $scope.songsList = [];
      const ipc = require('electron').ipcRenderer;

      $scope.showPlaylist = function(){
        if($scope.playListVisible)
        {
          $scope.playListVisible = false;
        }
        else {
          $scope.playListVisible = true;
        }
      }

      $scope.seekToTime = function($event){
        $scope.player.seek($event.clientX / window.innerWidth);
      }

      $scope.playPlaylistSong = function(index){
        $scope.player.skipTo(index);
      }

      $scope.nextSound = function(){
        $scope.player.skip('next');
        $scope.songPlaying=true;
      }
      $scope.prevSound = function(){
        $scope.player.skip('prev');
        $scope.songPlaying=true;
      }

      $scope.playPause = function(){
        if($scope.songPlaying)
        {
          $scope.songPlaying=false;
          $scope.player.pause();
        }
        else {
          $scope.songPlaying=true;
          $scope.player.play();
        }

      }

      var Player = function(playlist) {
        this.playlist = playlist;
        this.index = 0;
      };

      Player.prototype = {
        /**
         * Play a song in the playlist.
         * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
         */
        play: function(index) {
          var self = this;
          var sound;

          index = typeof index === 'number' ? index : self.index;
          var data = self.playlist[index];
          $scope.trackName = data.name;
          // If we already loaded this track, use the current one.
          // Otherwise, setup and load a new Howl.
          if (data.howl) {
            sound = data.howl;
          } else {
            sound = data.howl = new Howl({
              src: [data.file],
              html5: true,
              onplay: function() {
                // Display the duration.
                // duration.innerHTML = self.formatTime(Math.round(sound.duration()));
                $scope.timer = self.formatTime(Math.round(sound.duration()));
                requestAnimationFrame(self.step.bind(self));
                $scope.$apply();
              },
              onend: function() {
                // Stop the wave animation.
                self.skip('right');
              }
            });
          }

          // Begin playing the sound.
          sound.play();


          // Keep track of the index we are currently playing.
          self.index = index;
        },

        /**
         * Pause the currently playing track.
         */
        pause: function() {
          var self = this;

          // Get the Howl we want to manipulate.
          var sound = self.playlist[self.index].howl;

          // Puase the sound.
          sound.pause();
        },

        /**
         * Skip to the next or previous track.
         * @param  {String} direction 'next' or 'prev'.
         */
        skip: function(direction) {
          var self = this;

          // Get the next track based on the direction of the track.
          var index = 0;
          if (direction === 'prev') {
            index = self.index - 1;
            if (index < 0) {
              index = self.playlist.length - 1;
            }
          } else {
            index = self.index + 1;
            if (index >= self.playlist.length) {
              index = 0;
            }
          }

          self.skipTo(index);
        },

        /**
         * Skip to a specific track based on its playlist index.
         * @param  {Number} index Index in the playlist.
         */
        skipTo: function(index) {
          var self = this;

          // Stop the current track.
          if (self.playlist[self.index].howl) {
            self.playlist[self.index].howl.stop();
          }

          // Play the new track.
          self.play(index);
        },

        /**
         * The step called within requestAnimationFrame to update the playback position.
         */
        step: function() {
          var self = this;

          // Get the Howl we want to manipulate.
          var sound = self.playlist[self.index].howl;

          // Determine our current seek position.
          var seek = sound.seek() || 0;
          timer.innerHTML = self.formatTime(Math.round(seek));
          progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

          // If the sound is still playing, continue stepping.
          if (sound.playing()) {
            requestAnimationFrame(self.step.bind(self));
          }
        },
        formatTime: function(secs) {
          var minutes = Math.floor(secs / 60) || 0;
          var seconds = (secs - minutes * 60) || 0;

          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        },
        seek: function(time) {
          var self = this;

          // Get the Howl we want to manipulate.
          var sound = self.playlist[self.index].howl;

          // Convert the percent into a seek position.
          if (sound.playing()) {
            sound.seek(sound.duration() * time);
          }
        }
      }

      ipc.on('modal-next-song', function (event, arg) {
        $scope.nextSound();
      });

      ipc.on('modal-prev-song', function (event, arg) {
        $scope.prevSound();
      });

      ipc.on('modal-pause-song', function (event, arg) {
        $scope.playPause();
      });

      ipc.on('modal-folder-content', function (event, arg) {
        var message = `Asynchronous message reply: ${arg}`;
        console.log(arg.path);
        $scope.songsList = arg.files;
        $scope.$apply();
        var songsArrayForPlaying = [];
        for(var i=0;i<$scope.songsList.length;i++){
          songsArrayForPlaying.push(
            {
              title: arg.path+'/'+$scope.songsList[i],
              file: arg.path+'/'+$scope.songsList[i],
              howl: null,
              name:$scope.songsList[i]
            }
          );
        }
        $scope.player = new Player(songsArrayForPlaying);
        $scope.wave = new SiriWave({
            container: waveform,
            width: window.innerWidth,
            height: window.innerHeight * 0.3,
            cover: true,
            speed: 0.03,
            amplitude: 0.7,
            frequency: 2
        });
        $scope.wave.start();
        $scope.$apply();
      })

}])
