var static = require('node-static');
var http = require('http');
var file = new(static.Server)(); // A node-static server instance listening on port 8181

// We use the http module’s createServer function and our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8181);
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket){

  socket.on('join', function (channel) {
    console.log(socket.id + 'joins' + channel);
    socket.join(channel);
    socket.to(channel).emit('joined', socket.id + ' in ' + channel);
  });

  socket.on('message', function (message) {
    remoteLog('S --> Got message from you: ', message);
    socket.to(message.channel).emit('message', message.message);
  });

  socket.on('Bye', function(channel){
    socket.to(channel).emit('Bye');
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