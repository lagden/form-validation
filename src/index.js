'use strict'

// For IE
import objectAssign from 'object-assign'

// Internal store of all Tooltip intances
const instances = {}

// Globally unique identifiers
let GUID = 0

class FormValidation {
	static addCustomValidation(name, fn) {
		if (typeof fn === 'function') {
			this._custom[name] = fn
		} else {
			throw new TypeError('✖ Is not a function')
		}
	}

	static removeCustomValidation(name) {
		if (this._custom && this._custom[name]) {
			this._custom[name] = null
			if ('Reflect' in window) {
				Reflect.deleteProperty(this._custom, name)
			} else {
				this._custom[name] = null
				delete this._custom[name]
			}
			return true
		}
		return false
	}

	static custom(name) {
		return this._custom[name] || false
	}

	static data(element) {
		const id = element && element.GUID
		return id && instances[id]
	}

	constructor(element, options = {}) {
		if (typeof element === 'string') {
			const frm = document.querySelector(element)
			if (frm) {
				this.frm = frm
			} else {
				throw new Error('✖ Form not found')
			}
		} else {
			this.frm = element
		}

		if (this.frm instanceof HTMLFormElement === false) {
			throw new TypeError('✖ The element is not HTMLFormElement')
		}

		// Check if element was initialized and return your instance
		const initialized = FormValidation.data(this.frm)
		if (initialized instanceof FormValidation) {
			return initialized
		}

		// Storage current instance
		const id = ++GUID
		this.frm.GUID = id
		instances[id] = this

		this.options = {
			submit: null,
			invalid: null,
			submitted: 'submitted'
		}

		objectAssign(this.options, options)

		this.currentInvalids = []
		this.campos = Array && Array.from ? Array.from(this.frm.elements) : Array.prototype.slice.call(this.frm.elements)
		this.frm.addEventListener('submit', this, false)
	}

	get invalids() {
		return this.currentInvalids
	}

	_cleanup() {
		for (let i = 0; i < this.campos.length; i++) {
			const el = this.campos[i]
			if (el.hasAttribute('data-disabled-validation')) {
				el.disabled = false
				el.removeAttribute('data-disabled-validation')
			}
		}
	}

	_customValidation(el) {
		const customValidation = el.getAttribute('data-custom-validation') || false
		if (customValidation) {
			const validationMethods = customValidation.split(',').map(v => v.trim())
			for (let i = 0; i < validationMethods.length; i++) {
				const fn = FormValidation.custom(validationMethods[i])
				if (typeof fn === 'function') {
					const result = fn(el.value)
					el.setCustomValidity(result.valid ? '' : result.validationMessage)
					if (result.valid === false) {
						break
					}
				}
			}
		}
		return el
	}

	validation() {
		const invalids = []
		for (let i = 0; i < this.campos.length; i++) {
			let el = this.campos[i]
			if (el.getClientRects().length > 0 || el.type === 'hidden') {
				el.disabled = false
				el.removeAttribute('data-disabled-validation')
				el = this._customValidation(this.campos[i])
				if (el.validity && el.validity.valid === false) {
					invalids.push({
						title: (el.dataset && el.dataset.title) || el.title || el.name || false,
						msg: el.validationMessage,
						element: el
					})
				}
			} else {
				el.setAttribute('data-disabled-validation', '')
				el.disabled = true
			}
		}
		return invalids
	}

	onSubmit(event) {
		event.preventDefault()
		this.frm.classList.add(this.options.submitted)
		this.currentInvalids = this.validation()
		if (typeof this.frm.checkValidity !== 'function') {
			this.frm.checkValidity = () => this.currentInvalids.length === 0
		}
		if (this.frm.checkValidity()) {
			if (typeof this.options.submit === 'function') {
				this.options.submit(this.frm)
			} else {
				this.frm.submit()
			}
			this._cleanup()
		} else if (typeof this.options.invalid === 'function') {
			this.options.invalid(this.currentInvalids)
		}
	}

	destroy() {
		const id = this.frm.GUID
		instances[id] = null
		if ('Reflect' in window) {
			Reflect.deleteProperty(instances, id)
			Reflect.deleteProperty(this.frm, GUID)
		} else {
			delete instances[id]
			delete this.frm.GUID
		}
		this.frm.removeEventListener('submit', this, false)
		this.frm = null
		this.currentInvalids = null
		this.campos = null
	}

	handleEvent(event) {
		const ev = `${event.type.charAt(0).toUpperCase()}${event.type.slice(1)}`
		if (this[`on${ev}`]) {
			this[`on${ev}`](event)
		}
	}
}

FormValidation._custom = {}

export default FormValidation
