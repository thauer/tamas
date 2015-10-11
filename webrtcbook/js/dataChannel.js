var sendChannel, receiveChannel

var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");

startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

startButton.onclick = function () {

  var servers = null;
  var pc_constraints = { 'optional': [{'DtlsSrtpKeyAgreement':true}]};
  localPeerConnection = new webkitRTCPeerConnection(servers, pc_constraints);

  localPeerConnection.onicecandidate = function(event) {
    if( event.candidate ) {
      remotePeerConnection.addIceCandidate(event.candidate);
    }
  };

  sendChannel = localPeerConnection.createDataChannel("sendDataChannel", {reliable: true});

  handleSendChannelStateChange = function() {
    var readyState = sendChannel.readyState;
    if(readyState == "open") {
      dataChannelSend.disabled = false;
      dataChannelSend.focus();
      dataChannelSend.placeholder = "";
      sendButton.disabled = false;
      closeButton.disabled = false;
    } else {
      dataChannelSend.disabled = true;
      sendButton.disabled = true;
      closeButton.disabled = true;
    }
  } 

  sendChannel.onopen = handleSendChannelStateChange;
  sendChannel.onclose = handleSendChannelStateChange;

  window.remotePeerConnection = new webkitRTCPeerConnection(servers, pc_constraints);

  remotePeerConnection.onicecandidate = function(event) {
    if( event.candidate ) {
      localPeerConnection.addIceCandidate(event.candidate);
    }
  };

  remotePeerConnection.ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onopen = function() {};
    receiveChannel.onmessage = function(event) {
      document.getElementById("dataChannelReceive").value = event.data;
      document.getElementById("dataChannelSend").value = ""
    };
    receiveChannel.onclose = function() {};
  };

  localPeerConnection.createOffer(
    function(offer) {
      localPeerConnection.setLocalDescription(offer);
      remotePeerConnection.setRemoteDescription(offer);
      remotePeerConnection.createAnswer(
        function(answer) {
          localPeerConnection.setRemoteDescription(answer);
          remotePeerConnection.setLocalDescription(answer);
        },
        function(error) {console.log('Failed to create signaling message ' + error.name); }
      )
    }, 
    function(error) { console.log('Failed to create signaling message: ' + error.name); }
  )

  startButton.disabled = true;
  closeButton.disabled = false;
}

sendButton.onclick = function () {
  var data = document.getElementById("dataChannelSend").value;
  sendChannel.send(data);
}

closeButton.onclick = function () {
  sendChannel.close();
  receiveChannel.close();
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = "";
  dataChannelReceive.value = "";
  dataChannelSend.disabled = true;
  dataChannelSend.placeholder = "1: Press Start; 2: Enter text; 3: Press Send.";
}

