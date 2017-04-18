/**
 * Created by lijinde on 17-3-9.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev.js');
var proxy = require('proxy-middleware');
var url = require('url');
module.exports = function(app) {
    app.use('/scripts', proxy(url.parse('http://localhost:3006/scripts')));
    var server = new WebpackDevServer(webpack(config), {
        contentBase: __dirname+'/build/dev',
        hot: true,
        inline: true, //实时刷新
        quiet: false,
        noInfo: false,
       // publicPath: '/scripts/',
        stats: { colors: true }
    }).listen(3006, 'localhost', function() {
        console.log('socketio listen 3006')
    });
}