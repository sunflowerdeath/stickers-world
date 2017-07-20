const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: './app/index.js',

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
							},
							modules: false
						}]
					]
				}
			},

			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					/* ... */
				}
			}
		],
	},

	// resolve: {
		// // extensions: [.js, .json, .jsx, .css],
		// // extensions that are used
	// },
	
	alias: {
		'@@': path.resolve(__dirname)
	},

	devtool: 'source-map', // enum

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true, // enable gzip compression
		hot: true // hot module replacement. Depends on HotModuleReplacementPlugin
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
}
