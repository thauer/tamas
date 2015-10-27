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

  remotePeerConnection.ondatachannel = function(event) {
    console.log("remotePeerConnection.ondatachannel( %o )", event);
    receiveChannel = event.channel;
    receiveChannel.onopen = function() {
      console.log("receiveChannel<%o>.onopen()", receiveChannel);
    };
    receiveChannel.onmessage = function(event) {
      console.log("receiveChannel.onmessage(%o)", event);
      receiveArea.value = event.data;
      sendArea.value = ""
    };    
    receiveChannel.onclose = function() {
      console.log("receiveChannel.onclose()");
    };
  };

  sendChannel = localPeerConnection.createDataChannel("sendDataChannel", {reliable: true});
  console.log("Created sendChannel = %o", sendChannel);

  sendChannel.onopen = function() {
    console.log("sendChannel<%o>.onopen()", sendChannel)
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    dataChannelSend.placeholder = "";
    sendButton.disabled = false;
    closeButton.disabled = false;    
  }

  sendChannel.onmessage = function(event) {
    console.log("sendChannel.onmessage(%o)", event);
  }

  sendChannel.onclose = function() {
    console.log("sendChannel.onclose()")
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;    
  }

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
    } 
  );
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

