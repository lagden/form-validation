/* eslint babel/new-cap: 0 */
/* eslint no-new: 0 */

'use strict';

import test from 'ava';
import FormValidation from '../';

test('instance', t => {
	const fv = new FormValidation('#frm');
	t.true(fv instanceof FormValidation);
});

test('exception', t => {
	t.throws(() => new FormValidation('#notfound'), '✖ Form not found');
});
