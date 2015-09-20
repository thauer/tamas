var localStream, localPeerConnection, remotePeerConnection;
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = function() {
  startButton.disabled = true;
  navigator.webkitGetUserMedia({audio:true, video:true}, 
    function(stream) {
      localVideo.src = URL.createObjectURL(stream);
      localStream = stream;
      callButton.disabled = false;
    }, 
    function(error){ 
      console.log("navigator.getUserMedia error: ", error); 
    }
  );
};

callButton.onclick = function() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  var servers = null;
  localPeerConnection = new webkitRTCPeerConnection(servers);
  remotePeerConnection = new webkitRTCPeerConnection(servers);

  localPeerConnection.onicecandidate = function(event) {
    console.log("localPeerConnection.onicecandidate( %o )", event);
    if(event.candidate)
      remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  };

  remotePeerConnection.onicecandidate = function(event) {
    console.log("remotePeerConnection.onicecandidate( %o )", event);
    if(event.candidate)
      localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
  };

  remotePeerConnection.onaddstream = function gotRemoteStream(event){
    console.log("remotePeerConnection.onaddstream( %o )", event);
    remoteVideo.src = window.URL.createObjectURL(event.stream);
  }

  localPeerConnection.addStream(localStream);

  localPeerConnection.createOffer(
    function(description) {
      console.log("createOffer.callback( %o )", description);
      localPeerConnection.setLocalDescription(description);
      remotePeerConnection.setRemoteDescription(description);
      remotePeerConnection.createAnswer(
        function(description) {
          console.log("createAnswer.callback( %o )", description);
          remotePeerConnection.setLocalDescription(description);
          localPeerConnection.setRemoteDescription(description);
        },
        function(error){ console.log("Failed to create signaling message: " + error.name )}
      );
    }
  );
};
