/**
 * Generic Functions.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 08-Dec-2020
 * Last Updated: 25-Jan-2021
*/

/**
 * Module exports.
 * @public
*/

var exports = module.exports = {}
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