'use strict';

const http = require('http');
const pify = require('pify');
const getPort = require('get-port');

const host = exports.host = 'localhost';

exports.createServer = function () {
	return getPort().then(port => {
		const s = http.createServer((req, resp) => s.emit(req.url, req, resp));

		s.host = host;
		s.port = port;
		s.url = `http://${host}:${port}`;
		s.protocol = 'http';

		s.listen = pify(s.listen, Promise);
		s.close = pify(s.close, Promise);

		return s;
	});
};
