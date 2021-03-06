'use strict'

function extend(a, b) {
	Object.keys(b).forEach(prop => {
		a[prop] = b[prop]
	})
	return a
}

function del(obj, k) {
	obj[k] = null
	if ('Reflect' in window) {
		Reflect.deleteProperty(obj, k)
	} else {
		delete obj[k]
	}
	return obj
}

let instances = {}
let GUID = 0

class FormValidation {
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

		const initialized = FormValidation.data(this.frm)
		if (initialized instanceof FormValidation) {
			return initialized
		}

		const id = ++GUID
		this.frm.GUID = id
		instances[id] = this

		this.options = {
			always: null,
			submit: null,
			invalid: null
		}

		extend(this.options, options)

		this.currentInvalids = []
		this.campos = this.frm.elements
		this._listeners('addEventListener')
	}

	get invalids() {
		return this.currentInvalids
	}

	_listeners(method) {
		this.frm[method]('submit', this, false)
		for (let i = 0; i < this.campos.length; i++) {
			const el = this.campos[i]
			const customValidation = el.dataset.customValidation || false
			if (customValidation) {
				switch (el.type) {
					case 'text':
					case 'search':
					case 'email':
					case 'tel':
					case 'url':
					case 'number':
					case 'range':
						el[method]('input', this, false)
						break
					default:
						el[method]('change', this, false)
						break
				}
			}
		}
	}

	_cleanupElement(el) {
		if (el.dataset.disabledValidation) {
			el.disabled = false
			el.dataset = del(el.dataset, 'disabledValidation')
		}
	}

	_cleanup() {
		for (let i = 0; i < this.campos.length; i++) {
			const el = this.campos[i]
			this._cleanupElement(el)
		}
	}

	validation() {
		const invalids = []
		for (let i = 0; i < this.campos.length; i++) {
			const el = this.campos[i]
			if (el.getClientRects().length > 0 || el.type === 'hidden') {
				this._cleanupElement(el)
				if (el.validity && el.validity.valid === false) {
					invalids.push({
						title: el.dataset.title || el.title || el.name || '',
						msg: el.validationMessage,
						element: el
					})
				}
			} else {
				el.dataset.disabledValidation = ''
				el.disabled = true
			}
		}
		return invalids
	}

	_customValidation(event) {
		const el = event.currentTarget
		const customValidation = el.dataset.customValidation
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

	onInput(event) {
		this._customValidation(event)
	}

	onChange(event) {
		this._customValidation(event)
	}

	onSubmit(event) {
		event.preventDefault()
		this.currentInvalids = this.validation()
		if (this.frm.checkValidity()) {
			if (typeof this.options.submit === 'function') {
				this.options.submit(this.frm)
			} else {
				this.frm.submit()
			}
			this._cleanup()
		} else if (typeof this.options.invalid === 'function') {
			this.options.invalid(this.frm, this.currentInvalids)
		}
		if (typeof this.options.always === 'function') {
			this.options.always(this.frm)
		}
	}

	destroy() {
		const id = this.frm.GUID
		instances = del(instances, id)
		this._listeners('removeEventListener')
		this.frm = del(this.frm, GUID)
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

	static addCustomValidation(name, fn) {
		if (typeof fn === 'function') {
			this._custom[name] = fn
		} else {
			throw new TypeError('✖ Is not a function')
		}
	}

	static removeCustomValidation(name) {
		if (this._custom && this._custom[name]) {
			this._custom = del(this._custom, name)
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
}

FormValidation._custom = {}

export default FormValidation
