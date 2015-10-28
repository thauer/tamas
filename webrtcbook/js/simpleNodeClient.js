var div = document.getElementById('scratchPad');
var msgButton = document.getElementById("msgButton");

var socket = io.connect('http://10.15.15.10:8181'); // Connects to server

channel = prompt("Enter signaling channel name:");
if (channel !== "") {
  console.log('Trying to join channel: ', channel);
  socket.emit('join', channel);
}

msgButton.onclick = function() {
  var chatMessage = prompt('Type message. Write "Bye" to quit conversation', "");

  if(chatMessage == "Bye"){
    logAndText('Sending "Bye" to server...; Going to disconnect');
    socket.emit('Bye', channel);
    socket.disconnect();
  } else {
    socket.emit('message', { channel: channel, message: chatMessage});
  }
}

socket.on('log', function (array){
  console.log.apply(console, array);
});

socket.on('joined', function (msg){
  logAndText('Joined server: ' + msg );
});

socket.on('message', function (msg){
  logAndText('Message in channel: ' + msg );
});

socket.on('Bye', function (){
  logAndText('Got "Bye" from other peer! Going to disconnect... Sending "Ack" to server');
  socket.emit('Ack');
  socket.disconnect();
});

function logAndText(msg, color) {
  console.log(msg);
  div.insertAdjacentHTML( 'beforeEnd', 
    '<p>' + (performance.now() / 1000).toFixed(3) + ' --> ' + msg + '</p>');
}
