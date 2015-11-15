
var localStream;

navigator.getUserMedia({audio:true, video:true},
  function(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
  }, 
  function(error){}
);

function newPeerConnection(peer) {
  peerConnection = new RTCPeerConnection(null);

  peerConnection.onaddstream = function(videoElement, event) {
    videoElement.src = URL.createObjectURL(event.stream);
  }.bind(this, document.getElementById("remoteVideo" + peer));

  peerConnection.onicecandidate = function(peerConnection, event) {
    if(event.candidate) {
      peerConnection.send({ type: 'candidate',
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate
      });
    }
  }.bind(this, peerConnection);

  peerConnection.send = function(peer, data) {
    x = JSON.parse(JSON.stringify(data));
    x.to = peer;
    ws.send(JSON.stringify(x));
  }.bind(this, peer);

  peerConnection.addStream(localStream);
  return peerConnection;
}

callButton.onclick = function() {
  ws = new WebSocket('ws://localhost:8000');

  ws.onmessage = function (messageEvent) {
    message = JSON.parse(messageEvent.data);
    console.log(Date.now() + " %d -> %d [%s, %o]", message.from, message.to, message.type, message);
    if( message.type === 'joined' ) {
      peerConnection = newPeerConnection(message.from);
      peerConnection.createOffer(function(peerConnection, offer) {
        console.log(Date.now() + ' createOffer_callback(%o)', offer);
        peerConnection.setLocalDescription(offer);
        peerConnection.send(offer);
      }.bind(this, peerConnection));
    } else if( message.type === 'offer' ) {
      peerConnection = newPeerConnection(message.from);
      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      peerConnection.createAnswer(function(peerConnection, answer){
        console.log(Date.now() + ' createAnswer_callback(%o)', answer);
        peerConnection.setLocalDescription(answer);
        peerConnection.send(answer)
      }.bind(this, peerConnection));
    } else if(message.type === 'answer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    } else if(message.type === 'candidate') {
      peerConnection.addIceCandidate(new RTCIceCandidate({
        sdpMLineIndex: message.sdpMLineIndex,
        candidate: message.candidate
      }));
    }
  };
}
