# Form Validation
[![Build Status][ci-img]][ci]
[![Coverage Status][cover-img]][cover]
[![Dependency Status][dep-img]][dep]
[![devDependency Status][devDep-img]][devDep]

[ci-img]:        https://travis-ci.org/lagden/form-validation.svg
[ci]:            https://travis-ci.org/lagden/form-validation
[cover-img]:     https://codecov.io/gh/lagden/form-validation/branch/master/graph/badge.svg
[cover]:         https://codecov.io/gh/lagden/form-validation
[dep-img]:       https://david-dm.org/lagden/form-validation.svg
[dep]:           https://david-dm.org/lagden/form-validation
[devDep-img]:    https://david-dm.org/lagden/form-validation/dev-status.svg
[devDep]:        https://david-dm.org/lagden/form-validation#info=devDependencies


Simple form validation

## Install

Via [NPM](https://www.npmjs.com/)

```
npm install lagden-validation --save
```


## Usage

Take a look in [example](https://github.com/lagden/form-validation/blob/master/example/index.html)


## API

```js
var fv = new FormValidation('#myFrm');
```

### Params

Name        | Type    | Default | Description
----------- | ------- | ------- | -----------
elementID   | string  | -       | ID of form element
options     | object  | `{submit: false, invalid: false, submitted: 'submitted'}` | Initial options

#### options

Name        | Type    | Default | Description
----------- | ------- | ------- | -----------
submit      | boolean \| function | `false` | Callback for submit action
invalid     | boolean \| function | `false` | Callback for invalids inputs
submitted   | string  | Style added to form when submitted


## License

MIT © [Thiago Lagden](http://lagden.in)
