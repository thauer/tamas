var localStream, remoteStream, peerConnection, remotePeerConnection;

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
  console.log("%o", navigator);
  navigator.webkitGetUserMedia({audio:true, video:true}, 
    function(stream) {
      console.log("getUserMedia.callback( %o )", stream)
      localVideo.src = URL.createObjectURL(stream);
      localStream = stream;
      callButton.disabled = false;
    }, 
    function(error){ 
      console.log("navigator.getUserMedia error: ", error); 
    }
  );
};

var pc_config = {'iceServers': [{'url':'stun:stun.l.google.com:19302'}]};
var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement':true}]};

var socket = io.connect('http://localhost:8181');

socket.on('message', function(message) {
  console.log("Msg on socket: %o", message)
});

callButton.onclick = function() {

  callButton.disabled = true;
  hangupButton.disabled = false;

  peerConnection = new webkitRTCPeerConnection(pc_config, pc_constraints);
  console.log("localPC = %o.new()", peerConnection);

  peerConnection.addStream(localStream);
  console.log("%o.addStream( %o )", peerConnection, localStream);

  peerConnection.onicecandidate = function(event) {
    if(event.candidate) {
      console.log("Local ICE candidate: %o %s", event, event.candidate.candidate);
      socket.emit('message', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid, 
        candidate: event.candidate.candidate });
    } 
  };

  peerConnection.onaddstream = function(event) {
    console.log('Remote stream added');
    attachMediaStream(remoteVideo, event.stream);
    remoteStream = event.stream;
  }

  peerConnection.createOffer(
    function(offer) {
      peerConnection.setLocalDescription(offer);
      socket.emit('message', offer);
    }
  );
};

hangupButton.onclick = function() {
  peerConnection.close();
  remotePeerConnection.close();
  console.log("hangup: %o, %o", peerConnection, remotePeerConnection);

  peerConnection = null;
  remotePeerConnection = null;

  hangupButton.disabled = true;
  callButton.disabled = false;

  socket.close();
}
