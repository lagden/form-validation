'use strict';

import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',
	format: 'umd',
	dest: 'dist/index.js',
	moduleName: 'FormValidation',
	plugins: [
		babel()
	],
	sourceMap: true
};
