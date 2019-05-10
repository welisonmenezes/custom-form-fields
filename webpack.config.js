const path = require('path');
const webpack = require('webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = 'production'; // [development, production]
let SERVICE_URL = JSON.stringify('http://development-url-here/');
const minimizer = [];
const plugins = [];
const min = '.min';

plugins.push(new CleanWebpackPlugin('./dist', {}));

plugins.push(new ExtractCssChunks(
    {
      filename: 'css/custom-form-fields' + min + '.css',
      chunkFilename: 'css/vendors' + min + '.css',
      hot: true,
      orderWarning: true,
      reloadAll: true,
      cssModules: true
    }
));

plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

if (mode === 'production') {

    minimizer.push(new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
            compress: { 
                warnings: false 
            },
            output: {
                comments: false
            }
        }
    }));

    minimizer.push(new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
            sourcemap: true,
            map: {
                inline: false,
                annotation: true
            }
        },
        cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }]
        }
    }));
}

// plugins.push(new HtmlWebpackPlugin({
//     template: 'index.html',
//     filename: 'index.html'
// }));

module.exports = {
	mode: mode,
    watch: true,
	entry: {
        bundle: ['./app/main.js']
	},
	output: {
		filename: 'js/custom-form-fields' + min + '.js',
		path: path.resolve(__dirname, 'dist'),
        publicPath: './',
        libraryTarget: 'umd',
        library: 'CustomFormFields'
	},
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|jpeg|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {  
                            name: '../[path][name].[ext]',
                            publicPath: './'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: ['node_modules', 'img']
    },
    plugins: plugins,
    optimization: {
        minimizer: minimizer,
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {}
        }
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, '/'),
        publicPath: '/',
        compress: true,
        port: 9000
    }
};