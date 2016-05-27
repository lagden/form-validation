(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.FormValidation = factory());
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
		babelHelpers.createClass(FormValidation, null, [{
			key: 'addCustomValidation',
			value: function addCustomValidation(name, fn) {
				if (typeof this.custom_ === 'undefined') {
					this.custom_ = {};
				}
				if (typeof fn === 'function') {
					this.custom_[name] = fn;
				} else {
					throw new TypeError('✖ Is not a function');
				}
			}
		}, {
			key: 'custom',
			value: function custom(name) {
				return this.custom_[name] || false;
			}
		}]);

		function FormValidation(fid) {
			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			babelHelpers.classCallCheck(this, FormValidation);

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

		babelHelpers.createClass(FormValidation, [{
			key: 'customValidation',
			value: function customValidation() {
				var invalid = [];
				this.campos.forEach(function(el) {
					var customValidation = el.dataset && el.dataset.customValidation || el.getAttribute('data-custom-validation');
					if (customValidation) {
						var validationMethods = customValidation.split(',').map(function(v) {
							return v.trim();
						});
						validationMethods.forEach(function(fnName) {
							var fn = FormValidation.custom(fnName);
							if (fn) {
								var result = fn(el.value);
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
		}, {
			key: 'validation',
			value: function validation() {
				var invalid = [];
				this.campos.forEach(function(el) {
					if (el.validity && el.validity.valid === false) {
						invalid.push({
							title: el.dataset && el.dataset.title || el.title || el.name || 'Atenção',
							msg: el.validationMessage
						});
					}
				});
				return invalid;
			}
		}, {
			key: 'onKeydown',
			value: function onKeydown(event) {
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
		}, {
			key: 'handleEvent',
			value: function handleEvent(event) {
				var ev = '' + event.type.charAt(0).toUpperCase() + event.type.slice(1);
				if (this['on' + ev]) {
					this['on' + ev](event);
				}
			}
		}]);
		return FormValidation;
	}();

	return FormValidation;

}));
//# sourceMappingURL=index.js.map