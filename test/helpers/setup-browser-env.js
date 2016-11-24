'use strict';

const jsdom = require('jsdom');

global.document = jsdom.jsdom([
	'<form id="frm" action="#test" method="GET">',
	'<label for="email">Email</label>',
	'<input type="email" id="email" name="email" required>',
	'<label for="zipcode">Zipcode</label>',
	'<input type="text" id="zipcode" name="zipcode" data-custom-validation="zipcode" required>',
	'<button id="btnSubmit" type="submit" formnovalidate>Send</button>',
	'</form>'
].join(''));
global.window = global.document.defaultView;
global.HTMLFormElement = global.window.HTMLFormElement;
