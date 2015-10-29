'use strict';

navigator.getUserMedia = navigator.webkitGetUserMedia;  // (Chrome)

var sendButton = document.getElementById("sendButton");
var sendTextArea = document.getElementById("dataChannelSend");
var receiveTextArea = document.getElementById("dataChannelReceive");
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var localStream;
var remoteStream;
var peerConnection;

//var room = prompt('Enter room name:');
//var socket = io.connect("http://localhost:8181");
//socket.emit('join', room);

// socket.on("created", function(room){
//   console.log('Created room ' + room);
// });

navigator.getUserMedia({video:true, audio: true}, 
  function(stream){
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(localStream); // (Chrome)
    localVideo.play()
  }, function(error){}
);
