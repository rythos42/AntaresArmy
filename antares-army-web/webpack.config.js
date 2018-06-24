var webpack = require('webpack');
var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    // This will be our app's entry point (webpack will look for it in the 'src' directory due to the modulesDirectory setting below). Feel free to change as desired.
    entry: [
        // Add the react hot loader entry point - in reality, you only want this in your dev Webpack config
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        'index.tsx'
    ],
    // Output the bundled JS to dist/app.js
    output: {
        filename: 'app.js',    
        publicPath: '/dist',
        path: path.resolve('dist')
    },
    resolve: {
        // Look for modules in .ts(x) files first, then .js(x)
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        // Add 'src' to our modulesDirectories, as all our app code will live in there, so Webpack should look in there for modules
        modules: ['src', 'node_modules'],
    },
    module: {
        rules: [
            // .ts(x) files should first pass through the Typescript loader, and then through babel
            { 
                test: /\.tsx?$/, 
                use: ['babel-loader', 'ts-loader']
            },
            {
                test:/\.(s*)css$/,
                use:['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'font/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new WebpackNotifierPlugin({ alwaysNotify: true }),
        new webpack.ProvidePlugin({ $: "jquery" })
    ]
};