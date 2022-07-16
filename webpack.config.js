const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'worker.js',
		path: path.join(__dirname, 'dist'),
	},
	devtool: 'cheap-module-source-map',
	mode: 'development',
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		fallback: {
			util: require.resolve('util/'),
			zlib: require.resolve('browserify-zlib'),
			stream: require.resolve('stream-browserify'),
			assert: require.resolve('assert/'),
			crypto: false,
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					// transpileOnly is useful to skip typescript checks occasionally:
					// transpileOnly: true,
				},
			},
		],
	},
};
