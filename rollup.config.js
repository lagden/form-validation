'use strict';

import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	format: 'amd',
	dest: 'dist/index.js',
	moduleName: 'lagdenValidation',
	plugins: [
		babel({
			runtimeHelpers: true,
			externalHelpers: false
		})
	]
};
