/**
 * Construction App Server.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 08-Dec-2020
 * Last Updated: 09-Dec-2020
 */

/**
 * Module dependencies.
 */
 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var passport = require('passport');


var env = process.env.NODE_ENV || 'development',
    config = require('./config/config.' + env);

//ROUTES FOR API END POINT 
var widgetsAPI = require('./api/v1/routes/widgets');
var usersAPI = require('./api/v1/routes/users');
var feedbacksAPI = require('./api/v1/routes/feedbacks');

var tools = require('./modules/tools');
var sessionManagement = require('./modules/sessionManagement');

var app = express();


//
// App level variables initialization
//
// value to play with on request start and end
app.set('executionsThisTime', 0);
app.set('config', config);

var cors = require('cors');
app.use(cors({origin: '*'}));



// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(express.static(path.join(__dirname, 'public')));

// session will not work for static content
app.set('trust proxy', 1) // trust first proxy
app.use(sessionManagement);

//
// General toolset
//
// on request start and on request end moved after static content
app.use(tools.onRequestStart);
app.use(tools.onRequestEnd);
app.use('/api/v1/widgets', widgetsAPI);
app.use('/api/v1/users', usersAPI);
app.use('/api/v1/feedbacks', feedbacksAPI);
//For dev system
app.listen(5000)


//
// error handling
//
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
	
	//var startDate = req.session.startDate;
//	var endDate = req.session.lastRequestDate;
	var resource = "main";
	
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	var errorStatus = err.status || 500;
	var catchResponse = {
		success:  false,
		message: err.message,
		errors: err,								
		//startDate:startDate,
		//endDate:endDate,
		url: req.url,
	};
	return res.status(errorStatus).json(catchResponse);
		
});

module.exports = app;
