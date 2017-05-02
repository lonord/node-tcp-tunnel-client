# node-tcp-tunnel-client
A tcp tunnel service of node.js powered by [Socket.io](https://socket.io) (client side)

server side is [here](https://github.com/lonord/node-tcp-tunnel-server)

This service is used for port forwarding between different computers.

## Usage

```bash
git clone https://github.com/lonord/node-tcp-tunnel-client.git
npm install
npm start
```

## Config
Some custom configure can be modify in `config.js`

- *`serviceUrl`* the websocket url of server side. Format is `http://YOUR_HOST_NAME:YOUR_PORT`.
The port is one which specified in config file of server side. 
Such as `http://example.com:13000'`.
- *`localPort`* The port of local computer to be forwarding.
- *`remotePort`* The port of server computer to forwarding local port.

## License
MIT