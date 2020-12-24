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


/**
   * @function fetchWidgets
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.fetchWidgets = [
 
    // Process request after validation and sanitization.
    (req, res, next) => {

		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
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
				
					dbLayer.widget.findAll({
							where: {},
							attributes : ['id','name','creater_name','url','status','createdAt'],
							order: [['id', 'ASC']],
							//limit: Limit,
					})
					.then(async function(widgets) {
						
						if (!widgets) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var widgetsList = []						
						for(var i =0 ; i < widgets.length;i++)
						{
							var widgetsObj = widgets[i].get();
							widgetsObj.id = widgetsObj.id.toString()
							widgetsList.push(widgetsObj);
							
						}
						return res.status(200).json(tools.successResponseObj(widgetsList,startDate,endDate,resource,req.url));
						
						
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
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
   * @function getWidget
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.getWidget = [
 
    // Process request after validation and sanitization.
    (req, res, next) => {

		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		var widgetID = req.params.id;
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
				
					dbLayer.widget_connection.findOne({
						where: {widget_id:widgetID},							
						attributes : ['is_github_connected','repo_id','repo_name','repo_owner','is_slack_connected','webhook','channel_name'],
							include: [ 
										{
											model:dbLayer.widget,
											attributes : ['name','url','status'],
										}
								],
							order: [['id', 'ASC']],
							//limit: Limit,
					})
					.then(async function(widget) {
						if (!widget) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var widgetData = widget.get();
						widgetData.name = widgetData.widget.name;
						widgetData.url = widgetData.widget.url;
						widgetData.status = widgetData.widget.status;
						widgetData.is_github_connected  = widgetData.is_github_connected 
						widgetData.repo_id  = widgetData.repo_id 
						widgetData.repo_name  = widgetData.repo_name 
						widgetData.repo_owner  = widgetData.repo_owner 
						widgetData.channelName  = widgetData.channel_name 
						widgetData.webhook  = widgetData.webhook 
							
						
						delete widgetData.widget
						return res.status(200).json(tools.successResponseObj(widget,startDate,endDate,resource,req.url));
						
						
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
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
   * @function createWidgets
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.createWidgets = [
 
    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Widget name must be specified.'),
    body('url').isLength({ min: 1 }).trim().withMessage('Widget URL must be specified.'),
    //body('creater_name').isLength({ min: 1 }).trim().withMessage('Creater Name must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('name').escape(),
   
    // Process request after validation and sanitization.
    (req, res, next) => {

			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "widgets";
			
			// Extract the validation errors from a request.
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));			 
			}
			else {
				
				var widgetPostData = {
					creater_name: req.body.user_name,
					name: req.body.name,
					url: req.body.url,
				}
				var widget = new dbLayer.widget(widgetPostData);	
				try {
						widget.save({
							widget
						}).then(async function(result) {
							
							var widgetsObj = result.get();			
							widgetsObj.id = widgetsObj.id.toString()
							return res.status(200).json(tools.successResponseObj(widgetsObj,startDate,endDate,resource,req.url));
						})		
				}
				catch(error) {
					//console.log('The error log ' + error);
					var message = "Error creating widget";
					return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				}
				
			}
    }
];


/**
   * @function updateWidget
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.updateWidget = [
 
    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Widget name must be specified.'),
    body('url').isLength({ min: 1 }).trim().withMessage('Widget URL must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('name').escape(),
   
    // Process request after validation and sanitization.
    (req, res, next) => {

			//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
			//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "widgets";
			var widgetID = req.params.id;
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
					
				try {
					dbLayer.widget.findOne({
						where: {
							id: widgetID
						 }
					})
					.then((widget) => {
						if(!widget) {
							
							var message = 'Widget not found';
								var	error = {
									"msg": "Widget not found",
									"param": "",
									"location": "body"
								};				
								return res.status(404).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
								
						} else {
							widget.update({
								name: req.body.name,
								url: req.body.url,
							});														
							return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));;
						}
					})
					.catch((error) => {		  
						var message =  'Widget record failed';
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
   * @function updateWidgetsStatus
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.updateWidgetsStatus = [
 
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
		var resource = "widget";
		
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
			var widgetID = req.body.id;
			try {
					dbLayer.widget.findOne({
						where: {
							id: widgetID
						 }
					})
					.then(async(widget) => {
						
						if(!widget) {
							
							var message = 'Widget not found';
								var	error = {
									"msg": "Widget not found",
									"param": "",
									"location": "body"
								};				
								return res.status(404).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
								
						} else {
							widget.update({
								status: req.body.status
							});														
							return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));;
						}
					})
					.catch((error) => {		  
						var message =  'Widget record failed';
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
   * @function deleteWidget
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.deleteWidget = [

		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),

	 // Process request after validation and sanitization.
    (req, res, next) => {
		
			//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
			//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "widget";
			const widgetID = req.params.id;
			// Extract the validation errors from a request.
			//const errors = validationResult(req);
			//Here we also need to delete the feedback and relevant items		
			dbLayer.widget.destroy({
				where: {
				id: widgetID,
			 }
			}).then(() => {
				
				return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
				
			})
			.catch((error) => {		  
				var message =  'Widget record failed';
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				
			});
	}

];


/**
   * @function getWidgetQuestions
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.getWidgetQuestions = [
		
		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
		try {
				
					dbLayer.question.findAll({
							attributes : ['id','name','display_text','tooltip','type','limit'],
							include: [ 
										{
											model:dbLayer.widget_question,
											where: {widget_id:req.body.id},
											attributes : ['id','widget_id','question_id','order','display_text','is_required','is_active','limit','option_id'],
											required: false,
										}
								],	
							order: [[dbLayer.widget_question,'order', 'ASC']],
							//limit: Limit,
					})
					
					.then(async function(questions) {
						if (!questions) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var questionsList = []						
						for(var i =0 ; i < questions.length;i++)
						{
							var questionObj = questions[i].get();
							var widgetQuestions = questionObj.widget_questions[0];
							questionObj.id = questionObj.id.toString();
							questionObj.widget_question_id = "0";
							questionObj.widget_id = req.body.id.toString();
							questionObj.question_id = questionObj.id.toString();
							if(questionObj.display_text )
								questionObj.display_text = questionObj.display_text
							else 
								questionObj.display_text = questionObj.name
							questionObj.display_text_value  = ""	
							questionObj.name = questionObj.name
							questionObj.type = questionObj.type
							questionObj.tooltip = questionObj.tooltip
							questionObj.is_required = true
							questionObj.is_active = true
							questionObj.limit = questionObj.limit
							questionObj.options = await dbLayer.question_option.findAll({where: {question_id: questionObj.question_id},attributes : ['id','label','value',]});	
							if(widgetQuestions){
								questionObj.widget_question_id = widgetQuestions.id.toString()
								questionObj.widget_id = widgetQuestions.widget_id.toString()
								questionObj.question_id = widgetQuestions.question_id.toString()
								questionObj.display_text_value = widgetQuestions.display_text
								questionObj.is_required = widgetQuestions.is_required
								//questionObj.name = widgetQuestions.name								
								questionObj.is_required = widgetQuestions.is_required
								questionObj.is_active = widgetQuestions.is_active
								questionObj.limit = widgetQuestions.limit
								questionObj.option_id = (widgetQuestions.option_id) ? widgetQuestions.option_id.toString() : "0"							
							}
							delete  questionObj.widget_questions;
							questionsList.push(questionObj);
							
						} 
						return res.status(200).json(tools.successResponseObj(questionsList,startDate,endDate,resource,req.url));
						
						
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					});     
				}     
				// catch error if the operation wasn't successful
				catch(error) {
					var message = "operation wasn't successful";
					return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				}
		}
		
];


/**
   * @function UpdateWidgetQuestions
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.UpdateWidgetQuestions = [
		
		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
		body('rows').isLength({ min: 1 }).trim().withMessage('Row Data must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
    // Process request after validation and sanitization.
    async (req, res, next) => {

		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(200).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
			try {
					var dataRow = JSON.parse(req.body.rows);
					//If first rows Does not contains widget_question_id or its values 0 than it mean we need to create the question otherwise we have to update it.
					if(dataRow[0].widget_question_id > 0 ){						
						//update Function
						
						for(var i =0 ; i < dataRow.length;i++)
						{
							
							var dataObj = dataRow[i];
			
							await dbLayer.widget_question.findOne({ id:dataObj.widget_question_id })
								.then(async function(obj) {
										// update
										if(obj) {
												var widgetQuestionData = {}
												widgetQuestionData.widget_id = req.body.id
												widgetQuestionData.question_id = dataObj.question_id
												widgetQuestionData.order = i+1
												widgetQuestionData.display_text = dataObj.display_text
												widgetQuestionData.is_required = dataObj.is_required
												widgetQuestionData.is_active = dataObj.is_active
												widgetQuestionData.limit = dataObj.limit
												widgetQuestionData.option_id = dataObj.option_id
												console.log(widgetQuestionData)
												await obj.update(widgetQuestionData);
											
										}
										
								}) 
						}
						return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));						
					} else {
						//create Function
							var dataInsertObj = [];
							for(var i =0 ; i < dataRow.length;i++)
							{
								var dataObj = dataRow[i];
								var widgetQuestionData = {}
								widgetQuestionData.widget_id = req.body.id
								widgetQuestionData.question_id = dataObj.question_id
								widgetQuestionData.order = i+1
								widgetQuestionData.display_text = dataObj.display_text
								widgetQuestionData.is_required = dataObj.is_required
								widgetQuestionData.is_active = dataObj.is_active
								widgetQuestionData.limit = dataObj.limit
								widgetQuestionData.option_id = dataObj.option_id
								dataInsertObj.push(widgetQuestionData)
							}
							dbLayer.widget_question.bulkCreate(dataInsertObj).then( function(result) {
								//console.log(result);
								return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
							})
							.catch((error) => {		  
								// catch error if the operation wasn't successful
								var message =  "operation wasn't successful";
								return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
							});
					}
			}  
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
		}
		
];

/**
   * @function unlinkConnection
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.unlinkConnection = [
		
		body('type').isLength({ min: 1 }).trim().withMessage('Widget ID must be specified.'),
		
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
    // Process request after validation and sanitization.
    async (req, res, next) => {

		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		
		const widgetID = req.params.id;
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(200).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
			try {
				
				dbLayer.widget_connection.findOne({
							where: {widget_id:widgetID},
							//limit: Limit,
					})
					.then(async function(gitHubData) {
						if (!gitHubData) {	
							//Need to add new connection data.	
							
							var message = 'Widget not found';
								var	error = {
									"msg": "Widget not found",
									"param": "",
									"location": "body"
								};				
								return res.status(404).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
						}  
						var updateData = {}
						if(req.body.type === 'github') {
							updateData.github_api_url = '';
							updateData.github_response = '';
							updateData.personal_access_token = '';
							updateData.repo_id = '';
							updateData.repo_name = '';
							updateData.repo_owner = '';
							updateData.repo_url = '';
							updateData.is_github_connected = false;
						}
						if(req.body.type === 'slack') {
							updateData.webhook = '';
							updateData.channel_name = '';		
							updateData.is_slack_connected = false;
						}
						//update the connection data.
						gitHubData.update(updateData);								
						return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));					
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					}); 
			}  
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
		}
		
];/**
   * @function SaveGitHubConnection
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/

/**
   * @function SaveGitHubConnection
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.SaveGitHubConnection = [
		
		body('repo_id').isLength({ min: 1 }).trim().withMessage('Widget ID must be specified.'),
		body('api_response').isLength({ min: 1 }).trim().withMessage('API Response must be specified.'),
		body('pac').isLength({ min: 1 }).trim().withMessage('Personal Access Token must be specified.'),
		body('api_url').isLength({ min: 1 }).trim().withMessage('Github API URL must be specified.'),
		body('repo_name').isLength({ min: 1 }).trim().withMessage('Repository must be specified.'),
		body('repo_owner').isLength({ min: 1 }).trim().withMessage('Repository Owner be specified.'),
		body('repo_url').isLength({ min: 1 }).trim().withMessage('Github Repo URL must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
    // Process request after validation and sanitization.
    async (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		
		const widgetID = req.params.id;
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(200).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
			try {
				
				dbLayer.widget_connection.findOne({
							where: {widget_id:widgetID},
							//limit: Limit,
					})
					.then(async function(gitHubData) {
						if (!gitHubData) {	
							//Need to add new connection data.	
							
							var widgetConnectionData = {
									widget_id: widgetID,
									github_api_url : req.body.api_url,
									github_response : req.body.api_response,
									personal_access_token : req.body.pac,
									repo_id : req.body.repo_id,
									repo_name : req.body.repo_name,
									repo_owner : req.body.repo_owner,
									repo_url : req.body.repo_url,
									is_github_connected : true
								}								
								var gitHubConnect = new dbLayer.widget_connection(widgetConnectionData);	
								try {
										gitHubConnect.save({
											widgetConnectionData
										}).then(function(result) {											
											//var widgetsObj = result.get();			
											return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
										})		
								}catch(error) {
									//console.log('The error log ' + error);
									var message = "Error creating widget";
									return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
								}
						}  
						//update the connection data.
						gitHubData.update({
							github_api_url : req.body.api_url,
							github_response : req.body.api_response,
							personal_access_token : req.body.pac,
							repo_id : req.body.repo_id,
							repo_name : req.body.repo_name,
							repo_owner : req.body.repo_owner,
							repo_url : req.body.repo_url,
							is_github_connected : true
						});								
						return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));					
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					}); 
			}  
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
		}
		
];

/**
   * @function SaveSlackConnection
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.SaveSlackConnection = [
		
		body('channel').isLength({ min: 1 }).trim().withMessage('Widget ID must be specified.'),
		body('webhook').isLength({ min: 1 }).trim().withMessage('API Response must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
    // Process request after validation and sanitization.
    async (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "widgets";
		
		const widgetID = req.params.id;
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(200).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));
		}
			try {
				
				dbLayer.widget_connection.findOne({
							where: {widget_id:widgetID},
							//limit: Limit,
					})
					.then(async function(gitHubData) {
						if (!gitHubData) {	
							//Need to add new connection data.	
							
							var widgetConnectionData = {
									widget_id: widgetID,
									channel_name : req.body.channel,
									webhook : req.body.webhook,
									is_slack_connected : true
								}								
								var gitHubConnect = new dbLayer.widget_connection(widgetConnectionData);	
								try {
										gitHubConnect.save({
											widgetConnectionData
										}).then(function(result) {											
											//var widgetsObj = result.get();			
											return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
										})		
								}catch(error) {
									//console.log('The error log ' + error);
									var message = "Error creating widget";
									return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
								}
						}  
						//update the connection data.
						gitHubData.update({
								channel_name : req.body.channel,
								webhook : req.body.webhook,
								is_slack_connected : true
						});								
						return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));					
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'Widgets fetching failed';
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
						
					}); 
			}  
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
		}
		
];