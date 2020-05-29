var express = require('express');
var mongoDb = require('./utilities/indexDB');
var app = express();
var session = require('express-session');

//setting secret for express session
app.use(session({
    secret: 'user',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

//initializing database
mongoDb.intializeDatabase();

//setting ejs template
app.set('view engine', 'ejs');

//set the path for static resources to be accessible
app.use('/assets', express.static('assets'));

//custom route implementation
var connection = require('./controllers/connection.js');
app.use('/', connection);

var savedCon = require('./controllers/userProfile.js');
app.use('/', savedCon);

var index = require('./controllers/index.js');
app.use('/', index);

app.listen(8080);