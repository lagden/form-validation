'use strict'

import test from 'ava'
import simulant from 'simulant'
import FormValidation from '../src/index'

function validZipcode(v) {
	return {
		valid: /^(\d{5})-(\d{3})$/.test(v),
		validationMessage: 'Invalid zipcode'
	}
}

test.beforeEach(t => {
	t.context.btn = document.querySelector('#btnSubmit')
	t.context.input = document.querySelector('#zipcode')
	t.context.frmElement = document.querySelector('#frm')
	t.context.fv = new FormValidation(t.context.frmElement)
})

test.afterEach(t => {
	if (t.context.fv.frm) {
		t.context.fv.destroy()
	}
})

// jsdom doesn't support Form validation :(
test('validation', t => {
	const invalids = t.context.fv.validation()
	// t.is(invalids.length, 3) // expected
	t.is(invalids.length, 0)
})

test('[exception] instance from string', t => {
	t.throws(() => new FormValidation('#wrongID'), '✖ Form not found')
})

test('[exception] instance from element', t => {
	t.throws(() => new FormValidation(t.context.btn), '✖ The element is not HTMLFormElement')
})

test('instance from string and get initialized', t => {
	const fv = new FormValidation('#frm')
	t.true(fv === t.context.fv)
})

test('add custom validation', t => {
	FormValidation.addCustomValidation('zipcode', validZipcode)
	t.true(FormValidation.custom('zipcode') === validZipcode)
})

test('[exception] add custom validation', t => {
	t.throws(() => FormValidation.addCustomValidation('another', 'validZipcode'), '✖ Is not a function')
})

test('[not found] get custom validation', t => {
	t.false(FormValidation.custom('another'))
})

test('remove customValidation', t => {
	t.true(FormValidation.removeCustomValidation('zipcode'))
})

test('onSubmit', async t => {
	t.plan(1)
	t.context.input.value = '05433-010'
	const onSubmit = () => new Promise(resolve => {
		t.context.fv.frm.onsubmit = () => {
			resolve(t.context.fv.currentInvalids.length)
			t.context.fv.frm.onsubmit = null
		}
		simulant.fire(t.context.btn, simulant('click'))
	})
	const total = await onSubmit()
	t.is(total, 0)
})

test('onSubmit callback', async t => {
	t.plan(1)
	t.context.input.value = '05433-010'
	const onSubmit = () => new Promise(resolve => {
		t.context.fv.options.submit = frm => {
			resolve(frm.id)
		}
		simulant.fire(t.context.btn, simulant('click'))
	})
	const frm = await onSubmit()
	t.is(frm, 'frm')
})

test('destroy', t => {
	t.context.fv.destroy()
	t.is(t.context.fv.frm, null)
})
