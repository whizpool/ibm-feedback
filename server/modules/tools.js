/**
 * Module dependencies.
 * @private
 */

/**
 * Module exports.
 * @public
 */

var exports = module.exports = {};

/**
 * Module variables.
 * @private
 */

/**
 * Handles request start actions.
 *
 * @public
 */

exports.onRequestStart = function(req, res, next) {
    var executions = req.app.get('executionsThisTime');
    req.app.set('executionsThisTime', ++executions);
    if (req.session.startDate) {
        req.session.lastRequestDate = Date.now();
    } else {
        req.session.startDate = Date.now();
        req.session.lastRequestDate = Date.now();
    }
    next();
}

/**
 * Handles request end actions.
 *
 * @public
 */

exports.onRequestEnd = function(req, res, next) {
    function afterResponse() {
        var executions = req.app.get('executionsThisTime');
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);

        console.log('Executed ' + executions + ' times');
    }

    res.on('finish', afterResponse);
    res.on('close', afterResponse);

    next();
}


/**
 * Test function.
 *
 * @public
 */

exports.testFunction = function(req, res, next) {
    console.log('This one is a test only');
    console.log(req);
    next();
}


/**
 * Milliseconds conversion.
 *
 * @public
 */
exports.convertMillisecondsToStringDate = function(s) {
    var d = new Date(s);
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" +
        ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}

/**
 * Milliseconds conversion from DateString.
 *
 * @public
 */
exports.convertStringDateToMilliseconds = function(s) {
    var d = new Date(s);
	//return milliseconds = d.getTime() ; 
	return seconds = Math.trunc(d.getTime() / 1000); 
}

/**
 * Milliseconds conversion from DateString.
 *
 * @public
 */
exports.convertMillisecondsTodateFormat = function(s) {
    var d = new Date(s);
	//return milliseconds = d.getTime() ; 
	//'2020/05/07 01:03:35',
	return d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" +
        ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" +
        ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}




/**
 * IsValidJSONString 
 *
 * @public
 */
exports.IsValidJSONString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/**
 * prepareResponseObj 
 *
 * @public
 */
exports.successResponseObj = function(ResponseData,startDate,endDate,resource,url) {
	
	var env = process.env.NODE_ENV || 'development',
    config = require('./../config/config.' + env);
	var successResponse = {}
	successResponse.success = true;
	successResponse.data = ResponseData;								
	if(config.debug == true) {
		successResponse.startDate = startDate;
		successResponse.endDate = endDate;
		successResponse.resource = resource;
		successResponse.url = url;		
	}
	return successResponse;
}

/**
 * errorResponseObj 
 *
 * @public
 */
exports.errorResponseObj = function(errors,erroeMsg,startDate,endDate,resource,url) {
	
	var env = process.env.NODE_ENV || 'development',
    config = require('./../config/config.' + env);
	var errorResponse = {}
	errorResponse.success = false;
	errorResponse.message = erroeMsg;
	errorResponse.errors = errors;
	if(config.debug == true) {
		errorResponse.startDate = startDate;
		errorResponse.endDate = endDate;
		errorResponse.resource = resource;
		errorResponse.url = url;		
	}
	return errorResponse;
}