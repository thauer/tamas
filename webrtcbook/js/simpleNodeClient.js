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
// Handle 'created' message
socket.on('created', function (channel) {
  console.log('channel ' + channel + ' has been created!');
  console.log('This peer is the initiator...');

  // Dynamically modify the HTML5 page
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Channel ' + channel + ' has been created!'));
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('This peer is the initiator...'));
});

// Handle 'full' message
socket.on('full', function (channel) {
  console.log('channel ' + channel + ' is too crowded! \
    Cannot allow you to enter, sorry :-(');
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Channel ' + channel + ' is too crowded! sorry'));
});

// Handle 'remotePeerJoining' message
socket.on('remotePeerJoining', function (channel){
  console.log('Request to join ' + channel);
  console.log('You are the initiator!');
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Server msg: request to join ' + channel, 'red' ));
});

// Handle 'joined' message
socket.on('joined', function (msg){
  console.log('Message from server: ' + msg);
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Message from server: '));
  div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' + msg + '</p>');
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Message from server: '));
  div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' + msg + '</p>');
});

// Handle 'broadcast: joined' message
socket.on('broadcast: joined', function (msg){
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Broadcast message from server:', 'red'));
  div.insertAdjacentHTML( 'beforeEnd', '<p style="color:red">' + msg + '</p>');
  console.log('Broadcast message from server: ' + msg);

  socket.emit('message', 
    { channel: channel, message: prompt('Message to be sent to peer:', "")});
});

// Handle remote logging message from server
socket.on('log', function (array){
  console.log.apply(console, array);
});

function stampedPar(msg, color) {
  if(typeof color == 'undefined') {
    return '<p>Time: ' + (performance.now() / 1000).toFixed(3) + ' --> ' + msg + ' </p>';
  } else {
    return '<p style="color:' + color + '">Time: ' + (performance.now() / 1000).toFixed(3) + ' --> ' + msg + ' </p>'; 
  }
}

// Handle 'message' message
socket.on('message', function (message){
  console.log('Got message from other peer: ' + message);
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Got message from other peer:'));
  div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' + message + '</p>');

  socket.emit('response', 
    { channel: channel, message: prompt('Send response to peer:', "")});
});

// Handle 'response' message
socket.on('response', function (response){
  console.log('Got response from other peer: ' + response);
  div.insertAdjacentHTML( 'beforeEnd', stampedPar( 'Got response from other peer: '));
  div.insertAdjacentHTML( 'beforeEnd', '<p style="color:blue">' + response + '</p>');

  var chatMessage = prompt('Keep on chatting. Write "Bye" to quit conversation', "");

  if(chatMessage == "Bye"){
    div.insertAdjacentHTML( 'beforeEnd', stampedPar('Sending "Bye" to server...'));
    console.log('Sending "Bye" to server');
    socket.emit('Bye', channel);
    div.insertAdjacentHTML( 'beforeEnd', stampedPar('Going to disconnect...'));
    console.log('Going to disconnect...');
    // Disconnect from server
    socket.disconnect();
  } else {
    // Keep on going: send response back
    // to remote party (through server)
    socket.emit('response', {
    channel: channel,
    message: chatMessage});
  }
});

// Handle 'Bye' message
socket.on('Bye', function (){
  console.log('Got "Bye" from other peer! Going to disconnect...');
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Got "Bye" from other peer!'));
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Sending "Ack" to server'));
  // Send 'Ack' back to remote party (through server)
  console.log('Sending "Ack" to server');
  socket.emit('Ack');
  // Disconnect from server
  div.insertAdjacentHTML( 'beforeEnd', stampedPar('Going to disconnect...'));
  console.log('Going to disconnect...');
  socket.disconnect();
});