'use strict';

function extend(a, b) {
	Object.keys(b).forEach(prop => {
		a[prop] = b[prop];
	});
	return a;
}

if ('assign' in Object === false) {
	Object.assign = extend;
}

class FormValidation {
	constructor(fid, options = {}) {
		this.options = {
			submit: false,
			invalid: false,
			submitted: 'submitted'
		};

		Object.assign(this.options, options);

		this.frm = document.querySelector(fid);
		if (this.frm) {
			if ('from' in Array) {
				this.campos = Array.from(this.frm.elements);
			} else {
				this.campos = Array.prototype.slice.call(this.frm.elements);
			}
			this.frm.addEventListener('keydown', this, false);
			this.frm.addEventListener('submit', this, false);
		} else {
			throw new TypeError('✖ Form not found');
		}
	}

	validation() {
		const invalid = [];
		this.campos.forEach(el => {
			if (el.validity.valid === false) {
				invalid.push({
					title: el.dataset.title || el.title,
					msg: el.validationMessage
				});
			}
		});
		return invalid;
	}

	onTab(event) {
		let elfocus;
		let focusNext;
		if (event.which === 13) {
			event.preventDefault();
			const focused = document.activeElement;
			focusNext = false;
			this.campos.forEach(el => {
				if (focusNext) {
					elfocus = el;
				}
				focusNext = el === focused;
			});
			if (elfocus) {
				elfocus.focus();
				if (elfocus.type === 'submit') {
					if (elfocus.click) {
						elfocus.click();
					} else {
						const syntheticEvent = document.createEvent('MouseEvents');
						syntheticEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
						elfocus.dispatchEvent(syntheticEvent);
					}
				}
			}
		}
	}

	onSubmit(event) {
		event.preventDefault();
		this.frm.classList.add(this.options.submitted);
		const invalids = this.validation();
		if (invalids.length === 0) {
			if (typeof this.options.submit === 'function') {
				this.options.submit(this.frm);
			} else {
				this.frm.submit();
			}
		} else if (typeof this.options.invalid === 'function') {
			this.options.invalid(invalids);
		} else {
			invalids.forEach(o => {
				console.info(o);
			});
		}
	}

	handleEvent(event) {
		switch (event.type) {
			case 'keydown':
				this.onTab(event);
				break;
			case 'submit':
				this.onSubmit(event);
				break;
			default:
				console.info('Event without handler', event.type);
		}
	}
}

export default FormValidation;
