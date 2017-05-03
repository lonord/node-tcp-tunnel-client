const debug = require('debug')('tunnel:client');
const events = require('./event');
const ClientHandler = require('./client-handler');
const socketIO = require('socket.io-client');
const md5 = require('js-md5');

module.exports = function (serviceUrl, username, password, remotePort, localPort) {
	const socket = socketIO(serviceUrl);
	let clientHandler;

	socket.on('connect', () => {
		debug('socket.on connect');
		if (clientHandler) {
			clientHandler.removeAllListeners();
		}
		socket.emit(events.sys.INIT, {
			port: remotePort,
			username: username,
			password: md5(password)
		});
		clientHandler = new ClientHandler(localPort);
		clientHandler.on(events.DISCONNECTED, pack => {
			debug('clientHandler.on DISCONNECTED');
			socket.emit(events.DISCONNECTED, pack);
		});
		clientHandler.on(events.DATA, pack => {
			debug('clientHandler.on DATA');
			socket.emit(events.DATA, pack);
		});
	});
	socket.on('disconnect', () => {
		debug('socket.on disconnect');
		clientHandler && clientHandler.closeAll();
	});
	socket.on(events.CONNECTED, pack => {
		debug('socket.on CONNECTED');
		clientHandler && clientHandler.handleMsgConnect(pack);
	});
	socket.on(events.DISCONNECTED, pack => {
		debug('socket.on DISCONNECTED');
		clientHandler && clientHandler.handleMsgDisconnect(pack);
	});
	socket.on(events.DATA, pack => {
		debug('socket.on DATA');
		clientHandler && clientHandler.handleMsgData(pack);
	});
	socket.on(events.sys.ERROR, msg => {
		debug('socket.on sys.ERROR');
		console.log(`Error: ${msg}`);
		clientHandler && clientHandler.closeAll();
	});
}