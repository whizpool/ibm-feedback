/**
 * User controller for API endpoint.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 28-May-2020
 * Last Updated: 29-May-2020
 */

/**
 * Module dependencies.
 */
 
var async = require('async')


var express = require('express');

var router = express.Router();
var env = process.env.NODE_ENV || 'development',
    config = require('../../../config/config.' + env);
	
var tools = require('../../../modules/tools');
var dbLayer = require('../../../modules/dbLayer');
const { Op } = require("sequelize");

//var auth = require('../../../modules/auth');
const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


/**
   * @function getAccessToken
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
var axios = require('axios');
var qs = require('qs');
exports.getAccessToken = [
 
    // Process request after validation and sanitization.
    (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "users";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
		else {
			try {
						const iamIdentityService = require('ibm-platform-services/iam-identity/v1');

				
					/*
					var data = qs.stringify({
					 'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
					'apikey': 'DI1n_GHLmOuRt_3AiqKglh4ABotkgbg2PsTe5UIjdZrC' 
					});
					var config = {
						method: 'post',
						url: 'https://iam.cloud.ibm.com/identity/token',
						headers: { 
							'Content-Type': 'application/x-www-form-urlencoded', 
							'Cookie': 'sessioncookie="57807040b5b4ce64"'
						},
						data : data
					};

					axios(config)
					.then(function (response) {
						console.log(JSON.stringify(response.data));
						return res.status(200).json(tools.successResponseObj(response.data,startDate,endDate,resource,req.url));
					})
					.catch(function (error) {
							return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
					});
					
				==========================================		
					const UserManagementV1 = require('ibm-platform-services/user-management/v1');
				
					const { IamAuthenticator } = require('ibm-platform-services/auth');
					
					const authenticator = new IamAuthenticator({
						apikey: 'DI1n_GHLmOuRt_3AiqKglh4ABotkgbg2PsTe5UIjdZrC' ,
					});

					const userManagementService = new UserManagementV1({
							authenticator,                                          
							serviceUrl: 'https://user-management.cloud.ibm.com', 
						}
					);

				const params = {
						accountId: '7c62a18e282e46738e7c1205a73aaa59',
						state: 'ACTIVE'
					};

					userManagementService.listUsers(params)
						.then(response => {
								console.log(JSON.stringify(response.result, null, 2));
								res.status(200).json(tools.successResponseObj(response.result,startDate,endDate,resource,req.url));
						})
						.catch(err => {
						console.warn(err)
						});
					*/

						const params = {
							id: 'ApiKey-7626fd98-6acc-4edf-b9ec-5f5eff1f4818',
						};

						iamIdentityService.getApiKey(params)
							.then(response => {
								apikeyEtag = response.headers['etag'];
								console.log(JSON.stringify(response.result, null, 2));
								res.status(200).json(tools.successResponseObj(response.result,startDate,endDate,resource,req.url));
							})
							.catch(err => {
								console.warn(err);
							});

				}     
					// catch error if the operation wasn't successful
					catch(error) {
						var message = "operation wasn't successful";
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
					}
        }
    }
];
/**
   * @function fetchusers
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.fetchUsers = [
 
    // Process request after validation and sanitization.
    (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "users";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
		else {
			try {
				
					dbLayer.user.findAll({
							where: {},
							attributes : ['id','name','email','role','status'],
							order: [['id', 'ASC']],
							//limit: Limit,
					})
					.then(async function(users) {
						
						if (!users) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var usersList = []						
						for(var i =0 ; i < users.length;i++)
						{
							var usersObj = users[i].get();
							usersObj.id = usersObj.id.toString()
							usersList.push(usersObj);
							
						}
						return res.status(200).json(tools.successResponseObj(usersList,startDate,endDate,resource,req.url));
						
						
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'users fetching failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					});     
				}     
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
        }
    }
];

/**
   * @function createUsers
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.createUsers = [
 
    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('user name must be specified.'),
    body('url').isLength({ min: 1 }).trim().withMessage('user URL must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('name').escape(),
   
    // Process request after validation and sanitization.
    (req, res, next) => {

			//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
			//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "users";
			
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			//const userData = req.body.userData;		

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));			 
			}
			else {
				
				var userPostData = {
					creater_name: "John Doe",
					name: req.body.name,
					url: req.body.url,
				}
				var user = new dbLayer.user(userPostData);	
				try {
						user.save({
							user
						}).then(async function(result) {
							
							var usersObj = result.get();			
							usersObj.id = usersObj.id.toString()
							return res.status(200).json(tools.successResponseObj(usersObj,startDate,endDate,resource,req.url));
						})		
				}
				catch(error) {
					//console.log('The error log ' + error);
					var message = "Error creating user";
					return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				}
				
			}
    }
];


/**
   * @function updateUsers
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.updateUsers = [
 
    // Validate fields.
    body('status').isLength({ min: 1 }).trim().withMessage('Status must be specified.'),
    body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('status').escape(),
    sanitizeBody('id').escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "user";
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		const userData = req.body.userData;		
		//Create User object with escaped and trimmed data (and the old id!)


		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
			 
		}
		else {
			var userID = req.body.id;
			try {
					dbLayer.user.findOne({
						where: {
							id: userID
						 }
					})
					.then(async(user) => {
						
						if(!user) {
							
							var message = 'user not found';
								var	error = {
									"msg": "user not found",
									"param": "",
									"location": "body"
								};				
								return res.status(404).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
								
						} else {
							user.update({
								status: req.body.status
							});														
							return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));;
						}
					})
					.catch((error) => {		  
						var message =  'user record failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					});
					
				}     
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
        }
    }
];


/**
   * @function deleteUser
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.deleteUser = [

		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),

	 // Process request after validation and sanitization.
    (req, res, next) => {
		
			//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
			//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "user";
			const userID = req.params.id;
			// Extract the validation errors from a request.
			//const errors = validationResult(req);
			//Here we also need to delete the feedback and relevant items		
			dbLayer.user.destroy({
				where: {
				id: userID,
			 }
			}).then(() => {
				
				return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
				
			})
			.catch((error) => {		  
				var message =  'User record failed';
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				
			});
	}

];

