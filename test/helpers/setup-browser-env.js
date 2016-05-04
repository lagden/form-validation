'use strict';

const jsdom = require('jsdom');

global.document = jsdom.jsdom([
	'<form id="frm" action="#test" method="GET">',
	'<label for="email">Email</label>',
	'<input type="email" id="email" name="email" required>',
	'<label for="password">Password</label>',
	'<input type="password" id="password" name="password" required>',
	'<button id="btnSubmit" type="submit">Send</button>',
	'</form>'
].join(''));

global.window = global.document.defaultView;
