var static = require('node-static');
var http = require('http');
var file = new(static.Server)();

var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8181);
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket){
  socket.on('join', function(){
    socket.join('aaa');
  });

  socket.on('message', function (message) {
    socket.to('aaa').emit('message', message);
  });
});