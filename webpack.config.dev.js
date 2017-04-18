const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        "scripts/app":[
            __dirname + "/assets/index.js",
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:3006'
        ],
        "scripts/vendor": ["react", 'react-dom', 'react-router'],
    },
    output: {
        path: __dirname + "/build/dev", //打包后的文件存放的地方
        filename: "[name].js",
        chunkFilename: "[name].js",
    },
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json"
        },
            {
                test: /\.js$/,
                loader: 'jsx-loader?harmony'
            },
            {
                test: /\.js$/,
                loaders: ['react-hot-loader', 'babel-loader?presets[]=es2015,presets[]=stage-2,presets[]=react,' +
                'plugins[]=transform-decorators-legacy'],
                include: path.join(__dirname, 'assets'),
                exclude: /node_modules/
            }, {
                test: /\.(scss|css)$/,
                loader: 'style-loader!css-loader!sass-loader' //添加对样式表的处理
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './assets/html/index.html'
        }),
        new webpack.BannerPlugin("CopyRight @ UNICC Frontend"),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['scripts/vendor', '/scripts/manifest'],
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([{
            from: './assets/images/', to: 'images'
        },
            {
                from: './assets/favicon.ico', to: 'favicon.ico'
            }]),
        new ExtractTextPlugin("styles/[name].css"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin (),
    ],
}