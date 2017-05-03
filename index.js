const config = require('./config');
const Client = require('./client');

let clients = config.pairs.map(pair => {
	return new Client(config.serviceUrl, pair.remotePort, pair.localPort);
})
