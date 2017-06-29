const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinifyPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        "scripts/app":[
            __dirname + "/assets/index.js",
        ]
    },
    output: {
        path: __dirname + "/build/prod", //打包后的文件存放的地方
        filename: "[name].[chunkhash:8].js",
        publicPath:"/",
        chunkFilename: "[name].[chunkhash:8].js",
    },
    module: { //在配置文件里添加JSON loader
        loaders: [{
            test: /\.json$/,
            loader: "json"
        },
            {
                test: /\.js$/,
                loader: 'jsx-loader?harmony',
                include: path.join(__dirname, 'assets'),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader?presets[]=es2015,presets[]=stage-2,presets[]=react,' +
                'plugins[]=transform-decorators-legacy'],
                include: path.join(__dirname, 'assets'),
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader' //添加对样式表的处理
            },
            {test: /\.css$/, loader: "style-loader!css-loader"},
            //font-awesome
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build/prod']),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            template: './assets/html/index.html'
        }),
        new webpack.BannerPlugin("CopyRight @ UNICC Frontend"),
        new webpack.optimize.UglifyJsPlugin(
            {
                compress: {warnings: false}
            }
        ),
        new webpack.optimize.CommonsChunkPlugin({
            name: "scripts/vendor",
            minChunks: function(module){
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "scripts/manifest",
            minChunks: Infinity
        }),

        new CopyWebpackPlugin([{
            from: './assets/images/', to: 'images'
        },
            {
                from: './assets/favicon.ico', to: 'favicon.ico'
            }]),
        new ImageMinifyPlugin({
            pngquant: {
                quality: '60-85'
            }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.NoErrorsPlugin ()
    ],
}