navigator.getUserMedia = navigator.webkitGetUserMedia;  // (Chrome)

var constraints = {audio: false, video: true};

var video = document.querySelector("video");

function successCallback(stream) {
//  window.stream = stream; // make the stream available to console for inspection
  video.src = window.URL.createObjectURL(stream); // (Chrome)
  video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
