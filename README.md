# Form Validation
[![Build Status][ci-img]][ci]
[![Coverage Status][cover-img]][cover]
[![Dependency Status][dep-img]][dep]
[![devDependency Status][devDep-img]][devDep]
[![XO code style][xo-img]][xo]

[ci-img]:        https://travis-ci.org/lagden/form-validation.svg
[ci]:            https://travis-ci.org/lagden/form-validation
[cover-img]:     https://codecov.io/gh/lagden/form-validation/branch/master/graph/badge.svg
[cover]:         https://codecov.io/gh/lagden/form-validation
[dep-img]:       https://david-dm.org/lagden/form-validation.svg
[dep]:           https://david-dm.org/lagden/form-validation
[devDep-img]:    https://david-dm.org/lagden/form-validation/dev-status.svg
[devDep]:        https://david-dm.org/lagden/form-validation#info=devDependencies
[xo-img]:        https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:            https://github.com/sindresorhus/xo


Simple form validation

## Install

Via [NPM](https://www.npmjs.com/)

```
npm install lagden-validation --save
```


## Usage

Take a look in [example](https://github.com/lagden/form-validation/blob/master/example/index.html)


## API

**FormValidation( element [, options ] )**

### Params

Name        | Type                       | Default   | Description
----------- | -------------------------- | --------- | -----------
element     | string OR HTMLFormElement  | -         | ID of form element OR the form element
options     | object                     | see below | Initial options


#### options

Name        | Type     | Default   | Description
----------- | -------- | --------- | -----------
submit      | function | null      | Callback for submit action
invalid     | function | null      | Callback for invalids inputs
submitted   | string   | submitted | Style added to form when submitted


## License

MIT © [Thiago Lagden](http://lagden.in)
