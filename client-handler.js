const debug = require('debug')('tunnel:client-handler');
const events = require('./event');
const net = require('net');
const EventEmitter = require('events');

const HOST = '127.0.0.1';

class ClientHandler extends EventEmitter {
	constructor(localPort) {
		super();
		this.servers = {};
		this.localPort = localPort;
	}

	handleMsgConnect(pack) {
		let id = pack.id;
		if (id) {
			let server = new net.Socket();
			server.connect(this.localPort, HOST, this.localConnected.bind(this, id, server));
			server.on('close', this.localDisconnected.bind(this, id));
			server.on('data', this.localData.bind(this, id));
			this.servers[id] = server;
			debug('handleMsgConnect id: %s', id);
		}
	}

	localConnected(id, server) {
		debug('localConnected id: %s', id);
	}

	localDisconnected(id) {
		this.emit(events.DISCONNECTED, {
			id: id
		});
		debug('localDisconnected id: %s', id);
	}

	localData(id, data) {
		this.emit(events.DATA, {
			id: id,
			data: data
		});
		debug('localData id: %s', id);
	}

	handleMsgDisconnect(pack) {
		let id = pack.id;
		if (id) {
			debug('handleMsgDisconnect id: %s', id);
			let server = this.servers[id];
			if (server) {
				server.end();
				delete this.servers[id];
			}
		}
	}

	handleMsgData(pack) {
		let id = pack.id;
		if (id) {
			debug('handleMsgData id: %s', id);
			let server = this.servers[id];
			if (server) {
				server.write(pack.data);
			}
		}
	}

	closeAll() {
		debug('closeAll');
		for (let id in this.servers) {
			let server = this.servers[id];
			server.end();
			server.destroy();
		}
		this.servers = {};
	}
}

module.exports = ClientHandler;