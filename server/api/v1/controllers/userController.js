/**
 * User controller for API endpoint.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 09-Dec-2020
 * Last Updated: 24-Dec-2020
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


const { IamAuthenticator } = require('ibm-platform-services/auth');


/**
   * @function UserVerifyFromIBM
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
var axios = require('axios');
var qs = require('qs');
exports.UserVerifyFromIBM = [
 
	 body('apikey').isLength({ min: 1 }).trim().withMessage('API Key must be specified.'),
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
					const iamIdentity = require('ibm-platform-services/iam-identity/v1');
				
					const authenticator = new IamAuthenticator({
						apikey: req.body.apikey,
					});
				
					
					const iamIdentityService = new iamIdentity({
							authenticator,                                          
							//serviceUrl: 'https://user-management.cloud.ibm.com', 
						}
					);
	
					const params = {};
					//Check SuperAdmin record in the db.
					dbLayer.user.findOne({
						where: {
							id: 1
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
							let userObj = user.get();
							
								iamIdentityService.listApiKeys(params)
								.then(response => {
									let apiResponse  = response.result.apikeys;
									//apikeyEtag = response.headers['etag'];
									let isValidAccount = false;
									for(i = 0; i < apiResponse.length;i++) {
											var apiData = apiResponse[i];
											if(apiData.account_id == userObj.account_id) {		
													isValidAccount = true;
													break;
											}
									}				
									if(isValidAccount) {
										
											//Get Access Token
											let access_token = ""
											var data = qs.stringify({
											 'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
											 'apikey': req.body.apikey,
											 'response_type':'cloud_iam'
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
											var successResponseObj = {}
											successResponseObj.access_token = response.data.access_token
											successResponseObj.refresh_token = response.data.refresh_token
											successResponseObj.account_id = apiData.account_id
											return res.status(200).json(tools.successResponseObj(successResponseObj,startDate,endDate,resource,req.url));
											//return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
											
										})
										.catch(function (error) {
												var message = 'Authentication failed';
												return res.status(401).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
										});
										
									}	 else {
										var message = 'Authentication failed';
										return res.status(401).json(tools.errorResponseObj([],message,startDate,endDate,resource,req.url));
									}
									
								})
								.catch(err => {
									var message = "operation wasn't successful";
									return res.status(500).json(tools.errorResponseObj(err,err.message,startDate,endDate,resource,req.url));
								});
						}
					})
					.catch((error) => {		  
						var message = "operation wasn't successful";
						return res.status(401).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
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
				
					//Using Curl Call with access token
					var config = {
						method: 'get',
						url: 'https://user-management.cloud.ibm.com/v2/accounts/'+req.body.accountid+'/users',
						headers: { 
							'Authorization': 'Bearer '+req.body.access_token
						}
					};
					axios(config)
							.then(function (response) {
								return res.status(200).json(tools.successResponseObj(response.data,startDate,endDate,resource,req.url));
								
						})
						.catch(function (error) {
								var message = 'Authentication failed';
								return res.status(400).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
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
   * @function inviteUsers
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.inviteUsers = [
 
    // Validate fields.
    body('email').isLength({ min: 1 }).trim().withMessage('User email must be specified.'),
    body('name').isLength({ min: 1 }).trim().withMessage('user name must be specified.'),
    body('role').isLength({ min: 1 }).trim().withMessage('Role must be specified.'),
   
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
				
						// InviteUser
						const inviteUserModel = {
							email: req.body.email,
							account_role: 'Member'
						};

						// Role
						const roleModel = {
							role_id: 'crn:v1:bluemix:public:iam::::role:'+req.body.role
						};

						// Attribute
						const attributeModel = {
							name: 'accountId',
							value: req.body.accountid
						};

						// Attribute
						const attributeModel2 = {
							name: 'resourceGroupId',
							value: '*'
						};

						// Resource
						const resourceModel = {
							attributes: [attributeModel, attributeModel2]
						};

						// InviteUserIamPolicy
						//const inviteUserIamPolicyModel = {type: 'access',roles: [roleModel],resources: [resourceModel]};
						const inviteUserIamPolicyModel = {
							type: 'access',
							roles: [roleModel],
							resources: [resourceModel]
						};

					
						const params = {
							users: [inviteUserModel],
							//iamPolicy: [inviteUserIamPolicyModel],
							//accessGroups: ['AccessGroupId-PublicAccess']
						};
									
						console.log(JSON.stringify(params))
						var config = {
							method: 'post',
							url: 'https://user-management.cloud.ibm.com/v2/accounts/'+req.body.accountid+'/users',
							headers: { 
								'Authorization': 'Bearer '+req.body.access_token,
								'Content-Type': 'application/json'
							},
							data:params
					};	
				
					axios(config)
							.then(function (result) {
								console.log(result.data.resources)
								return res.status(200).json(tools.successResponseObj(result.data.resources,startDate,endDate,resource,req.url));
								
						})
						.catch(function (error) {
							return res.status(400).json(tools.errorResponseObj(error,error.message,startDate,endDate,resource,req.url));
					});
				
					
				
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
			const IAMID = req.params.id;
			// Extract the validation errors from a request.
			//const errors = validationResult(req);
			//Here we also need to delete the feedback and relevant items	

			//Using Curl Call with access token
				var config = {
					method: 'delete',
					url: 'https://user-management.cloud.ibm.com/v2/accounts/'+req.body.accountid+'/users/'+IAMID,
					headers: { 
						'Authorization': 'Bearer '+req.body.access_token
					}
				};
				console.log(config)
				axios(config)
						.then(function (response) {
							return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
							
					})
					.catch(function (error) {
							var message = 'Authentication failed';
							return res.status(400).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
					});
						
	}

];
