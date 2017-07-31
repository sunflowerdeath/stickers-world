const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

var DEBUG = process.env.NODE_ENV !== 'production'

let plugins = []

if (DEBUG) {
	plugins.push(new webpack.HotModuleReplacementPlugin())
	plugins.push(new HtmlWebpackPlugin({
		template: 'src/index.html',
		title: 'Stickers world'
	}))
}

module.exports = {
	entry: './src/index.js',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		// publicPath: /assets/, // string
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				loader: 'babel-loader',
				options: {
					presets: [
						['env', {
						  targets: {
							browsers: ['last 2 versions', 'safari >= 7']
						  }
						}],
						'stage-0',
						'react'
					],
					plugins: ['transform-decorators-legacy']
				}
			}
		],
	},

	// resolve: {
		// // extensions: [.js, .json, .jsx, .css],
		// // extensions that are used
	// },
	
	resolve: {
		alias: {
			'@@': path.resolve(__dirname, 'src')
		}
	},

	devtool: 'source-map', // enum

	devServer: {
		disableHostCheck: true,
		contentBase: path.join(__dirname, 'dist'),
		compress: true, // enable gzip compression
		hot: true // hot module replacement. Depends on HotModuleReplacementPlugin
	},

	plugins: plugins
}
