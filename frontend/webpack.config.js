/* eslint-env node */
const path = require('path')
const config = require('gnoll/config/webpack')

const DEBUG = process.env.NODE_ENV !== 'production'

config.entry = ['babel-polyfill', './src/index.js']
config.output.publicPath = DEBUG ? '/' : '/static/'

config.module.rules.push({
	type: 'javascript/auto',
	test: /modernizr.config.json$/,
	use: ['modernizr-loader', 'json-loader']
})

config.resolve = {
	alias: {
		'@@': path.resolve(__dirname, 'src'),
		modernizr$: path.resolve(__dirname, 'modernizr.config.json')
	}
}

config.devServer = {
	historyApiFallback: true
}

module.exports = config
