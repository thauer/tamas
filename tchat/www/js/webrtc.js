  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

  RTCPeerConnection = webkitRTCPeerConnection;
  