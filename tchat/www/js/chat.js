
var ws = new WebSocket('ws://localhost:8000');

var localStream;
var peerConnection;

navigator.getUserMedia({audio:true, video:true},
  function(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
  }, 
  function(error){}
);

callButton.onclick = function() {
  ws.send(JSON.stringify({'type':'pair'}));
}

function newPeerConnection() {
  peerConnection = new webkitRTCPeerConnection(null);
  peerConnection.onaddstream = function(event) {
    console.log(Date.now() + ' onaddstream(%o)', event);
    remoteVideo.src = URL.createObjectURL(event.stream);
  };

  peerConnection.onicecandidate = function(event) {
    if(event.candidate) {
      console.log(Date.now() + ' {sdpMLineIndex: %d, sdpMid: %s, candidate: %so)', 
        event.candidate.sdpMLineIndex, event.candidate.sdpMid, event.candidate.candidate);
      ws.send(JSON.stringify({ type: 'candidate',
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate
      }));
    }
  };
  peerConnection.addStream(localStream);
  return peerConnection;
}

ws.onmessage = function (msg) {
  data = JSON.parse(msg.data);
  console.log(Date.now() + ' message(%o [%s])', data, data.type);
  if( data.type === 'pair' ) {
    peerConnection = newPeerConnection();
    peerConnection.createOffer(function(offer) {
      console.log(Date.now() + ' createOffer_callback(%o)', offer);
      peerConnection.setLocalDescription(offer);
      ws.send(JSON.stringify(offer));
    });
  } else if( data.type === 'offer' ) {
    peerConnection = newPeerConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    peerConnection.createAnswer(function(answer){
      console.log(Date.now() + ' createAnswer_callback(%o)', answer);
      peerConnection.setLocalDescription(answer);
      ws.send(JSON.stringify(answer))
    });
  } else if(data.type === 'answer') {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data));
  } else if(data.type === 'candidate') {
    peerConnection.addIceCandidate(new RTCIceCandidate({
      sdpMLineIndex: data.sdpMLineIndex,
      candidate: data.candidate
    }));
  }
};
