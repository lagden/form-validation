'use strict'

import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	entry: 'src/index.js',
	dest: 'dist/index.js',
	format: 'umd',
	moduleName: 'FormValidation',
	plugins: [
		buble(),
		nodeResolve({
			jsnext: false,
			main: true
		}),
		commonjs()
	],
	sourceMap: true
}
