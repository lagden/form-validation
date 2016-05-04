'use strict';

import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	format: 'umd',
	dest: 'dist/index.js',
	moduleName: 'lagdenValidation',
	plugins: [
		babel()
	]
};
