const express = require('express');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3005;
const ENV = process.env.NODE_ENV || 'development';
require('./app/Models');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: '12345',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*30,httpOnly:false,secure: false }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(cookieParser());


// Serve static assets
let staticPath = 'build/dev';
if(ENV ==='production'){
    app.use(compression());
    staticPath = 'build/prod';
}
else{
    require('./webpackdev.server')(app);
}
require('./app/controllers/ProjectController')(app);
require('./app/controllers/TaskController')(app);
require('./app/controllers/LoginController')(app);

app.use(express.static(path.resolve(__dirname, '.', staticPath)));
app.use(express.query());

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '.', staticPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

module.exports = app;

