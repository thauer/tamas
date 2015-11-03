
var video = document.querySelector("video");

navigator.webkitGetUserMedia( // (Chrome)
  {audio: false, video: true}, 
  function (stream) {
    video.src = window.URL.createObjectURL(stream); // (Chrome)
    video.play();    
  },
  function(error) {
    console.log("navigator.getUserMedia error: ", error)
  }
)
