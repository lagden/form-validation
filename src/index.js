'use strict';

// For IE
import objectAssign from 'object-assign';

class FormValidation {
	static addCustomValidation(name, fn) {
		if (typeof fn === 'function') {
			this.custom_[name] = fn;
		} else {
			throw new TypeError('✖ Is not a function');
		}
	}

	static removeCustomValidation(name) {
		if (this.custom_ && this.custom_[name]) {
			this.custom_[name] = null;
			if ('Reflect' in window) {
				Reflect.deleteProperty(this.custom_, name);
			} else {
				this.custom_[name] = null;
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

		objectAssign(this.options, options);

		this.currentInvalids = [];
		this.frm = document.querySelector(fid);
		if (this.frm) {
			this.campos = Array && Array.from ? Array.from(this.frm.elements) : Array.prototype.slice.call(this.frm.elements);
			this.frm.addEventListener('submit', this, false);
		} else {
			throw new Error('✖ Form not found');
		}
	}

	_customValidation(el) {
		const customValidation = el.getAttribute('data-custom-validation') || false;
		if (customValidation) {
			const validationMethods = customValidation.split(',').map(v => v.trim());
			for (let i = 0; i < validationMethods.length; i++) {
				const fn = FormValidation.custom(validationMethods[i]);
				if (typeof fn === 'function') {
					const result = fn(el.value);
					el.setCustomValidity(result.valid ? '' : result.validationMessage);
					if (result.valid === false) {
						break;
					}
				}
			}
		}
		return el;
	}

	validation() {
		const invalid = [];
		for (let i = 0; i < this.campos.length; i++) {
			let el = this.campos[i];
			if (el.getClientRects().length > 0) {
				el.disabled = false;
				el = this._customValidation(this.campos[i]);
				if (el.validity && el.validity.valid === false) {
					invalid.push({
						title: (el.dataset && el.dataset.title) || el.title || el.name || false,
						msg: el.validationMessage
					});
				}
			} else {
				el.disabled = true;
			}
		}
		return invalid;
	}

	onSubmit(event) {
		event.preventDefault();
		this.frm.classList.add(this.options.submitted);
		this.currentInvalids = this.validation();
		if (typeof this.frm.checkValidity !== 'function') {
			this.frm.checkValidity = () => this.currentInvalids.length === 0;
		}
		if (this.frm.checkValidity()) {
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

FormValidation.custom_ = {};

export default FormValidation;
