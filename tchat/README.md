# tchat

## Node
Make sure node is installed: (https://github.com/nodesource/distributions)
```
$ node -v
v5.1.0
$ npm -v
3.3.12
```

## node-static and static webserver

`node-static` is installed globally:
```
$ npm -g ls node-static
/usr/lib
└── node-static@0.7.7 
```

We'll be serving from the www directory
```
thauer@babar www$ static -a 0.0.0.0 -H '{"Cache-Control": "no-cache, must-revalidate"}'
serving "." at http://0.0.0.0:8080
9:49:15 [200]: /
```

## websocket protocol with `ws` and `wscat`

We'll use a websocket server to facilitate the signaling channel. To that end, let's install `ws` (https://github.com/websockets/ws) which also provides a command-line client out of the box.

```
thauer@babar www$ npm -g ls ws wscat
/usr/lib
├── ws@0.8.0 
└─┬ wscat@1.0.1 
  └── ws@0.8.0 
```

Test the wscat client first:
```
thauer@babar www$ wscat -c ws://echo.websocket.org
connected (press CTRL+C to quit)
> Hello, world!
< Hello, world!
> Bye
< Bye
> 
```

## The chat server

As far as the chat server, we want the following functionality:

* A client connects. The join notification is broadcast to all clients.
* A client sends a message to one of the other client
    - offer
    - answer
    - ICECandidate

In the browser, we use the WebSocket class (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). 

```
class WebSocket {
    void close(in optional unsigned long code, in optional DOMString reason);
    void send(in DOMString data);

    onmessage = function HandleEvent(MessageEvent event)
}

class MessageEvent extends Event {
    data: DOMString | Blob | ArrayBuffer  
}
```
