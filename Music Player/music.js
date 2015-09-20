var audio = null,volume = 1,pausedBoolean = false,counter = 0;
var songList = ["madari.wav","oasis.wav"];
function playMusic(liElement){
  if(undefined != songList[$(liElement).attr("data-number")] && null == audio)
  {
    $($(liElement).parent().children()[$(liElement).attr("data-number")]).append("<span class=\"glyphicon glyphicon-play-circle\" aria-hidden=\"true\"></span>");
    audio = new Audio(__dirname + '/music/'+songList[$(liElement).attr("data-number")]);
    audio.currentTime = 0;
    audio.play();
    $(".playerControls .glyphicon-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
  }
  else if(undefined != songList[$(liElement).attr("data-number")] && null != audio)
  {
    $("ul.songsListing .glyphicon").remove();
    $($(liElement).parent().children()[$(liElement).attr("data-number")]).append("<span class=\"glyphicon glyphicon-play-circle\" aria-hidden=\"true\"></span>");
    audio.pause();
    audio.src = __dirname + '/music/'+songList[$(liElement).attr("data-number")];
    audio.play();
    $(".playerControls .glyphicon-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
  }
}

function reduceVolume(){
  volume = audio.volume;
  volume = volume - 0.1;
  audio.volume = volume;
}

function increaseVolume(){
  volume = audio.volume;
  volume = volume + 0.1;
  audio.volume = volume;
}

function pauseMusic(){
  if(!pausedBoolean){
    $(".playerControls .glyphicon-pause").removeClass("glyphicon-pause").addClass("glyphicon-play");
    audio.pause();
    pausedBoolean = true;
  }
  else {
    audio.play();
    pausedBoolean = false;
    $(".playerControls .glyphicon-play").removeClass("glyphicon-play").addClass("glyphicon-pause");
  }
}

function lastSong(){
  counter --;
  if(counter < 0)
  {
    counter = 1;
  }
  audio.pause();
  audio.src = __dirname + '/music/'+songList[counter];
  audio.play();
}

function nextSong(){
  counter++;
  if(counter > 1)
  {
    counter = 0;
  }
  audio.pause();
  audio.src = __dirname + '/music/'+songList[counter];
  audio.play();
}

var ipc = require('ipc');
ipc.on('VolumeUp', function(){
  increaseVolume();
});

ipc.on('VolumeDown', function(){
  reduceVolume();
});

ipc.on('Paused', function(){
  pauseMusic();
});

ipc.on('Next', function(){
  nextSong();
});

ipc.on('Previous', function(){
  lastSong();
});
