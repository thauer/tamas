// Websocket-based simple communication setup
var socket;

joinButton.onclick = function() {
  socket = io.connect('http://10.15.15.10:8181');
  socket.emit('join');
};

closeButton.onclick = function() {
  socket.disconnect();
};

// WebRTC functionality uses the websocket channel
var peerConnection;

startButton.onclick = function() {
  navigator.webkitGetUserMedia({audio:true, video:true},
    function(stream) {
      localVideo.src = URL.createObjectURL(stream);

      servers = {'iceServers':[{'url':'stun:stun.l.google.com:19302'}]}; // null
      peerConnection = new webkitRTCPeerConnection(servers);
      peerConnection.addStream(stream);
      peerConnection.onaddstream = function(event) {
        remoteVideo.src = URL.createObjectURL(event.stream);
      };
      peerConnection.onicecandidate = function(event) {
        if(event.candidate) {
          socket.emit('message',{ type: 'candidate',
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate
          });
        }
      };

      socket.on('message', function (msg){
        if( msg.type === 'offer' ) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
          peerConnection.createAnswer(function(answer){
            peerConnection.setLocalDescription(answer);
            socket.emit('message',answer)
          });
        } else if(msg.type === 'answer') {
          peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
        } else if(msg.type === 'candidate') {
          peerConnection.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: msg.sdpMLineIndex,
            candidate: msg.candidate
          }));
        }
      });
    }, 
    function(error){}
  );
};

callButton.onclick = function() {
  peerConnection.createOffer(function(offer) {
    peerConnection.setLocalDescription(offer);
    socket.emit('message',offer);
  });
}
