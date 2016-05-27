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
	static addCustomValidation(name, fn) {
		if (typeof this.custom_ === 'undefined') {
			this.custom_ = {};
		}
		if (typeof fn === 'function') {
			this.custom_[name] = fn;
		} else {
			throw new TypeError('✖ Is not a function');
		}
	}

	static removeCustomValidation(name) {
		if (this.custom_[name]) {
			this.custom_[name] = null;
			if ('Reflect' in window) {
				Reflect.deleteProperty(this.custom_, name);
			} else {
				delete this.custom_[name];
			}
			return true;
		}
		return false;
	}

	static custom(name) {
		return this.custom_[name] || false;
	}

	constructor(fid, options = {}) {
		this.options = {
			submit: false,
			invalid: false,
			submitted: 'submitted'
		};

		Object.assign(this.options, options);

		this.currentInvalids = [];
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
			throw new Error('✖ Form not found');
		}
	}

	customValidation() {
		const invalid = [];
		this.campos.forEach(el => {
			const customValidation = el.dataset && el.dataset.customValidation || el.getAttribute('data-custom-validation');
			if (customValidation) {
				const validationMethods = customValidation.split(',').map(v => v.trim());
				validationMethods.forEach(fnName => {
					const fn = FormValidation.custom(fnName);
					if (fn) {
						const result = fn(el.value);
						if (result.valid === false) {
							invalid.push({
								title: el.dataset && el.dataset.title || el.title || el.name || 'Atenção',
								msg: result.validationMessage
							});
						}
					}
				});
			}
		});
		return invalid;
	}

	validation() {
		const invalid = [];
		this.campos.forEach(el => {
			if (el.validity && el.validity.valid === false) {
				invalid.push({
					title: el.dataset && el.dataset.title || el.title || el.name || 'Atenção',
					msg: el.validationMessage
				});
			}
		});
		return invalid;
	}

	onKeydown(event) {
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
		this.currentInvalids = this.validation().concat(this.customValidation());
		if (this.currentInvalids.length === 0) {
			if (typeof this.options.submit === 'function') {
				this.options.submit(this.frm);
			} else {
				this.frm.submit();
			}
		} else if (typeof this.options.invalid === 'function') {
			this.options.invalid(this.currentInvalids);
		}
	}

	handleEvent(event) {
		const ev = `${event.type.charAt(0).toUpperCase()}${event.type.slice(1)}`;
		if (this[`on${ev}`]) {
			this[`on${ev}`](event);
		}
	}
}

export default FormValidation;
