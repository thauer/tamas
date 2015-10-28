var static = require('node-static');
var http = require('http');
var file = new(static.Server)(); // A node-static server instance listening on port 8181

// We use the http module’s createServer function and our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8181);
// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(app);

var numClients = {};

io.sockets.on('connection', function (socket){

  socket.on('create or join', function (channel) {
    console.log('create or join ' + channel + '[' + numClients[channel] + ']');
    if(! (channel in numClients)){
      numClients[channel] = 0;
    }

    if (numClients[channel] == 0){
      socket.join(channel);
      numClients[channel] ++;
      socket.emit('created', channel);
    } else if (numClients[channel] == 1) {
      io.sockets.in(channel).emit('remotePeerJoining', channel);
      socket.join(channel);
      numClients[channel]++;
      socket.broadcast.to(channel).emit('broadcast: joined', 
        'client ' + socket.id + ' joined channel ' + channel);
    } else {
      console.log("Channel full!");
      socket.emit('full', channel);
    }
  });

  socket.on('message', function (message) {
    remoteLog('S --> Got message: ', message);
    socket.broadcast.to(message.channel).emit('message', message.message);
  });

  socket.on('response', function (response) {
    remoteLog('S --> Got response: ', response);
    socket.broadcast.to(response.channel).emit('response', response.message);
  });

  socket.on('Bye', function(channel){
    socket.broadcast.to(channel).emit('Bye');
    socket.disconnect();
    numClients[channel]--;
  });

  socket.on('Ack', function () {
    console.log('Got an Ack!');
    socket.disconnect();
  });

  function remoteLog(){
    var array = [">>> "];
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
    socket.emit('log', array);
  }
});