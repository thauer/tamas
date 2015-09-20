
var video = document.querySelector("video");
var stream

document.querySelector("button#qvga").onclick = function() {
  getMedia( { video: { mandatory: { maxWidth: 320, maxHeight: 240 } } } );
}

document.querySelector("button#vga").onclick = function() {
  getMedia( { video: { mandatory: { maxWidth: 640, maxHeight: 480 } } } );
}

function getMedia(constraints) {
  if(!!stream) {
    video.src = null;
    stream.stop();
  }
  navigator.webkitGetUserMedia(constraints, successCallback, errorCallback);
}

function successCallback(stream) {
  window.stream = stream; // make the stream available to console for inspection
  video.src = window.URL.createObjectURL(stream);
  video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}
