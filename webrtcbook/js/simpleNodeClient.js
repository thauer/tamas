// Get <div> placeholder element from DOM
div = document.getElementById('scratchPad');
// Connect to server
var socket = io.connect('http://localhost:8181');

// Ask channel name from user
channel = prompt("Enter signaling channel name:");
if (channel !== "") {
  console.log('Trying to create or join channel: ', channel);
  // Send 'create or join' to the server
  socket.emit('create or join', channel);
}

socket.on('log', function (array){
  console.log.apply(console, array);
});

socket.on('created', function (channel) {
  stampAddStuff('Channel ' + channel + ' has been created! This peer is the initiator...');
});

socket.on('full', function (channel) {
  stampAddStuff('Channel ' + channel + ' is too crowded! No entry, sorry');
});

socket.on('remotePeerJoining', function (channel){
  stampAddStuff('Server msg: request to join ' + channel + ' (You are the initiator)', 'red' );
});

socket.on('broadcast: joined', function (msg){
  stampAddStuff('Broadcast message from server:' + msg, 'red');
  socket.emit('message', 
    { channel: channel, message: prompt('Message to be sent to peer:', "")});
});

socket.on('message', function (message){
  stampAddStuff('Got message from other peer: ' + message, 'blue');
  socket.emit('response', 
    { channel: channel, message: prompt('Send response to peer:', "")});
});

socket.on('response', function (response){
  stampAddStuff( 'Got response from other peer: ' + response, 'blue');

  var chatMessage = prompt('Keep on chatting. Write "Bye" to quit conversation', "");

  if(chatMessage == "Bye"){
    stampAddStuff('Sending "Bye" to server...');
    socket.emit('Bye', channel);
    stampAddStuff('Going to disconnect...');
    socket.disconnect();
  } else {
    socket.emit('response', { channel: channel, message: chatMessage});
  }
});

socket.on('Bye', function (){
  stampAddStuff('Got "Bye" from other peer! Going to disconnect... Sending "Ack" to server');
  socket.emit('Ack');
  stampAddStuff('Going to disconnect...');
  socket.disconnect();
});

function addStuff(arg, color) {
  if(typeof color == 'undefined') {
    div.insertAdjacentHTML( 'beforeEnd', '<p>' + arg + '</p>');
  } else {
    div.insertAdjacentHTML( 'beforeEnd', '<p style="color:' + color + '">' + arg + '</p>')
  }
}

function stampAddStuff(msg, color) {
  console.log(msg);
  addStuff( 'Time: ' + (performance.now() / 1000).toFixed(3) + ' --> ' + msg, color);
}
