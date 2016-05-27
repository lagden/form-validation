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

// const WebDriver = require('selenium-webdriver');
// global.Assertion = WebDriver.Assertion;
// global.By = WebDriver.By;
// global.until = WebDriver.until;
// global.driver = new WebDriver
// 	.Builder()
// 	.withCapabilities(WebDriver.Capabilities.chrome())
// 	.build();
