#!/usr/bin/env node

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8000});

var socketID = 1;

wss.on('connection', function(ws) {
  ws.clientid = socketID++;
  wss.clients.forEach(function(client) {
    if( client !== ws ) {
      client.send(JSON.stringify({"type": "joined", "from": ws.clientid, "to": client.clientid}))
    }
  });
  ws.on('message', function(message) {
    console.log(message);
    try {      
      data = JSON.parse(message);
      wss.clients.forEach(function(client) {
        if( data.to == client.clientid || data.to == "0") {
          data.from = ws.clientid;
          client.send(JSON.stringify(data));
        }
      });
    }
    catch(err) {
      console.log('Error relaying: %s', message);
    }
  });
});
