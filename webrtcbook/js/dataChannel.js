var sendChannel, receiveChannel

var sendArea = document.getElementById("dataChannelSend");
var receiveArea = document.getElementById("dataChannelReceive");

var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");

startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

















startButton.onclick = function () {
  startButton.disabled = true;
  closeButton.disabled = false;

  var servers = null;
  var pc_constraints = { 'optional': [{'DtlsSrtpKeyAgreement':true}]};
  localPeerConnection = new webkitRTCPeerConnection(servers, pc_constraints);
  console.log("localPC = %o.new()", localPeerConnection);
  remotePeerConnection = new webkitRTCPeerConnection(servers, pc_constraints);
  console.log("rempotePC = %o.new()", remotePeerConnection);

  localPeerConnection.onicecandidate = function(event) {
    if( event.candidate ) {
      remotePeerConnection.addIceCandidate(event.candidate);
      console.log("Local ICE candidate: %o %s", event, event.candidate.candidate);
    }
  };

  remotePeerConnection.onicecandidate = function(event) {
    if( event.candidate ) {
      localPeerConnection.addIceCandidate(event.candidate);
      console.log("Remote ICE candidate: %o %s", event, event.candidate.candidate);
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

  remotePeerConnection.ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onopen = function() {};
    receiveChannel.onmessage = function(event) {
      receiveArea.value = event.data;
      sendArea.value = ""
    };
    receiveChannel.onclose = function() {};
  };

  localPeerConnection.createOffer(
    function(offer) {
      console.log("createOffer.callback( %o )", offer);
      localPeerConnection.setLocalDescription(offer);
      remotePeerConnection.setRemoteDescription(offer);
      remotePeerConnection.createAnswer(
        function(answer) {
          console.log("createAnswer.callback( %o )", answer);
          localPeerConnection.setRemoteDescription(answer);
          remotePeerConnection.setLocalDescription(answer);
        },
        function(error) {console.log('Failed to create signaling message ' + error.name); }
      );
      console.log("returned from createAnswer()");
    } 
  );
  console.log("returned from createOffer()");
}

sendButton.onclick = function () {
  var data = sendArea.value;
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

