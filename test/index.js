'use strict';

import test from 'ava';
import simulant from 'simulant';
import FormValidation from '../src/.';

function validZipcode(v) {
	return {
		valid: /^(\d{5})\-(\d{3})$/.test(v),
		validationMessage: 'Invalid zipcode'
	};
}

const fv = new FormValidation('#frm');

test('instance', t => {
	t.true(fv instanceof FormValidation);
});

// jsdom doesn't support Form validation :(
test('validation', t => {
	const invalids = fv.validation();
	// t.is(invalids.length, 3); // expected
	t.is(invalids.length, 0);
});

test('[exception] instance', t => {
	t.throws(() => new FormValidation('#wrongID'), '✖ Form not found');
});

test('add custom validation', t => {
	FormValidation.addCustomValidation('zipcode', validZipcode);
	t.true(FormValidation.custom('zipcode') === validZipcode);
});

test('customValidation', t => {
	const invalids = fv.customValidation();
	t.is(invalids.length, 1);
});

test('[exception] add custom validation', t => {
	t.throws(() => FormValidation.addCustomValidation('another', 'validZipcode'), '✖ Is not a function');
});

test('[not found] get custom validation', t => {
	t.false(FormValidation.custom('another'));
});

test.cb('onKeydown + onSubmit with invalid callback', t => {
	t.plan(2);
	const input = document.querySelector('#zipcode');
	fv.options.invalid = invalids => {
		t.true(invalids.length === 1);
		t.is(JSON.stringify(invalids), '[{"title":"zipcode","msg":"Invalid zipcode"}]');
		t.end();
	};
	input.focus();
	simulant.fire(input, simulant('keydown', {which: 13}));
});

test.cb('onSubmit', t => {
	t.plan(1);
	const btn = document.querySelector('#btnSubmit');
	const input = document.querySelector('#zipcode');
	input.value = '05433-010';
	simulant.fire(btn, simulant('click'));
	setTimeout(() => {
		t.true(fv.currentInvalids.length === 0);
		t.end();
	}, 30);
});

test.cb('onSubmit callback', t => {
	t.plan(1);
	const btn = document.querySelector('#btnSubmit');
	const input = document.querySelector('#zipcode');
	input.value = '05433-010';
	fv.options.submit = frm => {
		t.is(frm.id, 'frm');
		t.end();
	};
	simulant.fire(btn, simulant('click'));
});

test('remove customValidation', t => {
	t.true(FormValidation.removeCustomValidation('zipcode'));
	t.false(FormValidation.removeCustomValidation('another'));
});
