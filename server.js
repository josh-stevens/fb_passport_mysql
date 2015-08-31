var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var mysql = require('mysql');

var connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '',
          database: 'strength_tracker'
        });

require('./config/passport')(passport, connection);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
         saveUninitialized: true,
         resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




app.set('view engine', 'ejs');


// app.use('/', function(req, res){
//  res.send('Our First Express program!');
//  console.log(req.cookies);
//  console.log('================');
//  console.log(req.session);
// });

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);
