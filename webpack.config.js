const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: [path.resolve(__dirname, 'source'), path.resolve(__dirname, 'node_modules')],
        
    },
    devtool: 'source-map',
    module: {
        rules:[
            {
                test: /\.js$/,
                 exclude: /node_modules/, 
                 loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        })
    ]
}