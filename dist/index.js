(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.lagdenValidation = factory());
}(this, function() {
	'use strict';

	var babelHelpers = {};

	babelHelpers.classCallCheck = function(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	};

	babelHelpers.createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor)
					descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	babelHelpers;

	function extend(a, b) {
		Object.keys(b).forEach(function(prop) {
			a[prop] = b[prop];
		});
		return a;
	}

	if ('assign' in Object === false) {
		Object.assign = extend;
	}

	var FormValidation = function() {
		function FormValidation(fid, options) {
			babelHelpers.classCallCheck(this, FormValidation);

			if (this instanceof FormValidation === false) {
				return new FormValidation(fid, options);
			}

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

		babelHelpers.createClass(FormValidation, [{
			key: 'validation',
			value: function validation() {
				var invalid = [];
				this.campos.forEach(function(el) {
					if (el.validity.valid === false) {
						invalid.push({
							title: el.dataset.title || el.title,
							msg: el.validationMessage
						});
					}
				});
				return invalid;
			}
		}, {
			key: 'onTab',
			value: function onTab(event) {
				var _this = this;

				var elfocus = void 0;
				var focusNext = void 0;
				if (event.which === 13) {
					(function() {
						event.preventDefault();
						var focused = document.activeElement;
						focusNext = false;
						_this.campos.forEach(function(el) {
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
									var syntheticEvent = document.createEvent('MouseEvents');
									syntheticEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
									elfocus.dispatchEvent(syntheticEvent);
								}
							}
						}
					})();
				}
			}
		}, {
			key: 'onSubmit',
			value: function onSubmit(event) {
				event.preventDefault();
				this.frm.classList.add(this.options.submitted);
				var invalids = this.validation();
				if (invalids.length === 0) {
					if (typeof this.options.submit === 'function') {
						this.options.submit(this.frm);
					} else {
						this.frm.submit();
					}
				} else if (typeof this.options.invalid === 'function') {
					this.options.invalid(invalids);
				} else {
					invalids.forEach(function(o) {
						console.info(o);
					});
				}
			}
		}, {
			key: 'handleEvent',
			value: function handleEvent(event) {
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
		}]);
		return FormValidation;
	}();

	return FormValidation;

}));