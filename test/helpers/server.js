'use strict';

const http = require('http');
const getPort = require('get-port');
const pify = require('pify');
const host = exports.host = 'localhost';

function createServer(fn) {
	return () => {
		return getPort().then(port => {
			const server = http.createServer(fn);

			server.host = host;
			server.port = port;
			server.url = `http://${host}:${port}`;
			server.protocol = 'http';

			server.listen(port);
			server.close = pify(server.close);

			return server;
		});
	};
}

exports.createServer = createServer((req, res) => {
	const html = [
		'<body>',
		'<form id="frm" action="#test" method="GET">',
		'<label for="email">Email</label>',
		'<input type="email" id="email" name="email" required>',
		'<label for="zipcode">Zipcode</label>',
		'<input type="text" id="zipcode" name="zipcode" data-custom-validation="zipcode" required>',
		'<button id="btnSubmit" type="submit" formnovalidate>Send</button>',
		'</form>',
		'</body>'
	].join('');
	res.writeHead(200, {
		'content-type': 'text/html'
	});
	res.end(html);
});
