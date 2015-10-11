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

callButton.onclick = function() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  var servers = null;
  localPeerConnection = new webkitRTCPeerConnection(servers);
  console.log("localPC = %o.new()", localPeerConnection);
  remotePeerConnection = new webkitRTCPeerConnection(servers);
  console.log("rempotePC = %o.new()", remotePeerConnection);

  localPeerConnection.onicecandidate = function(event) {
    if(event.candidate) {
      remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
      console.log("Local ICE candidate: %o %s", event, event.candidate.candidate);
    }
  };

  remotePeerConnection.onicecandidate = function(event) {
    if(event.candidate) {
      localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
      console.log("Remote ICE candidate: %o %s", event, event.candidate.candidate);
    }
  };

  /* The onaddstream and onremovestream handlers are called any time 
      a MediaStream is respectively added or removed by the remote peer.
      Both will be fired only as a result of the execution of the 
      setRemoteDescription() method.
  */
  remotePeerConnection.onaddstream = function(event){
    console.log("remotePeerConnection.onaddstream( %o )", event);
    remoteVideo.src = window.URL.createObjectURL(event.stream);
  };

  console.log("%o.addStream( %o )", localPeerConnection, localStream);
  localPeerConnection.addStream(localStream);

  localPeerConnection.createOffer(
    function(offer) {
      console.log("createOffer.callback( %o )", offer);
      localPeerConnection.setLocalDescription(offer);
      remotePeerConnection.setRemoteDescription(offer);
      remotePeerConnection.createAnswer(
        function(answer) {
          console.log("createAnswer.callback( %o )", answer);
          remotePeerConnection.setLocalDescription(answer);
          localPeerConnection.setRemoteDescription(answer);
        },
        function(error){ console.log("Failed to create signaling message: " + error.name )}
      );
      console.log("returned from createAnswer()");
    }
  );
  console.log("returned from createOffer()");
};

hangupButton.onclick = function() {
  localPeerConnection.close();
  remotePeerConnection.close();
  console.log("hangup: %o, %o", localPeerConnection, remotePeerConnection);

  localPeerConnection = null;
  remotePeerConnection = null;

  hangupButton.disabled = true;
  callButton.disabled = false;
}
