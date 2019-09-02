const webpack = require('webpack')
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const CleanWebpackPlugin = require('clean-webpack-plugin');

require('dotenv').config()

module.exports = {
	mode: process.env.NODE_ENV,
	entry: './app/index.js',
	// devtool: 'source-map',
	devtool: process.env.NODE_ENV == 'development' && 'inline-source-map',
	output: {
		path: __dirname + '/static/js/bundle',
		publicPath: process.env.AVEECCLESIA_HOME + '/js/bundle/',
		filename: '[name].[chunkhash:3].js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader?cacheDirectory'
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: false,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	},
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
      'process.env':{
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new CleanWebpackPlugin(['static/js/bundle'], { verbose: true }),
		new CleanObsoleteChunks({ verbose: true, deep: true })
	]
}