var static = require('node-static');
var http = require('http');
var file = new(static.Server)(); // A node-static server instance listening on port 8181

// We use the http module’s createServer function and our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8181);
var io = require('socket.io').listen(app);

var numClients = 0;

io.sockets.on('connection', function (socket){

  socket.on('message', function (message) {
    socket.join('aaa');
    remoteLog('S --> Got message from you: ', message);
    socket.to(message.channel).emit('message', message);
  });

  socket.on('Bye', function(channel){
    socket.to(channel).emit('Bye');
    socket.disconnect();
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