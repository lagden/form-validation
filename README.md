# Form Validation
[![Build Status][ci-img]][ci]
[![Coverage Status][cover-img]][cover]
[![devDependency Status][devDep-img]][devDep]

[ci-img]:     https://travis-ci.org/lagden/form-validation.svg
[ci]:         https://travis-ci.org/lagden/form-validation
[cover-img]:  https://codecov.io/github/lagden/form-validation/coverage.svg?branch=master
[cover]:      https://codecov.io/github/lagden/form-validation?branch=master
[devDep-img]: https://david-dm.org/lagden/form-validation/dev-status.svg
[devDep]:     https://david-dm.org/lagden/form-validation#info=devDependencies


Simple form validation

## Install

Via [NPM](https://www.npmjs.com/)

```
npm install lagden-validation --save
```


## Usage

There are many ways use it!

### Simple

```js
var fv = new FormValidation('#myFrm');
```

### Simple with options

```js
var fv = new FormValidation('#myFrm', {
  submit: function(frm) {
    // do some stuff...
    frm.submit();
  }
});
```

### Custom validation

```html
<form action="/send" method="post">
  <input type="text" name="zipcode" data-custom-validation="zipcode" required>
  <button type="submit" formnovalidate>Send</button>
</form>

<script>
// zipcode validation
function validZipcode(v) {
  return {
    valid: /^(\d{5})\-(\d{3})$/.test(v),
    validationMessage: 'Invalid zipcode'
  };
}

// Add custom validation
FormValidation.addCustomValidation('zipcode', validZipcode);

// Create instance
var fv = new FormValidation('#myFrm');
</script>
```


## License

MIT © [Thiago Lagden](http://lagden.in)
