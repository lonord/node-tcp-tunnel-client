const config = require('./config');
const Client = require('./client');

let clients = config.pairs.map(pair => {
	return new Client(config.serviceUrl, config.username,
		config.password, pair.remotePort, pair.localPort);
})
