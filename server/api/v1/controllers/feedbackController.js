/**
 * feedback controller for API endpoint.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 9-Dec-2020
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
   * @function fetchFeedbacks
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.fetchFeedbacks = [
 
    // Process request after validation and sanitization.
    (req, res, next) => {

		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "feedbacks";
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
				 
					dbLayer.feedback.findAll({
							where: {},
							attributes : ['id','widget_id','screen_shot','createdAt'],
							include: [ 
								{
									model: dbLayer.widget,
									attributes : ['name','url']
								},	
								{
									model: dbLayer.feedback_answer,
									//attributes : ['answer'],
									include: [ 
										{
												model:dbLayer.widget_question,
												where:{},
												required: true,
												//attributes : ['option_id','limit'],
												include: [ 
													{
														model:dbLayer.question,
														//attributes : ['id'],
														where:{
															name: {
																		[Op.or]: [{ [Op.iLike]: '%rate%'}, { [Op.iLike]: '%email%'}]
															}
													}
												}
											],												
										}
									],
								},
							],
							order: [['id', 'DESC']],
							//limit: Limit,
					})
					.then(async function(feedbacks) {
						
						if (!feedbacks) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var feedbacksList = []						
						for(var i =0 ; i < feedbacks.length;i++)
						{
							var feedbacksObj = feedbacks[i].get();
							feedbacksObj.id = feedbacksObj.id.toString()
							feedbacksObj.widget_id = feedbacksObj.widget_id.toString()
							feedbacksObj.name = feedbacksObj.widget.name
							feedbacksObj.url = feedbacksObj.widget.url
							feedbacksObj.date = tools.convertMillisecondsTodateFormat(feedbacksObj.createdAt);		 
							for(var j =0 ; j < feedbacksObj.feedback_answers.length;j++)
							{
								var answerObj = feedbacksObj.feedback_answers[j].get();
								var fieldName = answerObj.widget_question.question.name;
								if(fieldName == "Rate Us") {
									fieldName = 'rating'
									var optionID = answerObj.widget_question.option_id
									feedbacksObj.rating_type = (await dbLayer.question_option.findOne({where: {id: optionID},attributes : ['value']})).value;	
								}
								else if(fieldName == "Email Address") {
									fieldName = 'email'
								}
								feedbacksObj[fieldName] = answerObj.answer
							}
							delete feedbacksObj.widget 
							delete feedbacksObj.feedback_answers 
							feedbacksList.push(feedbacksObj);
						}
						return res.status(200).json(tools.successResponseObj(feedbacksList,startDate,endDate,resource,req.url));
						
						
					})
					.catch((error) => {		  
						// catch error if the operation wasn't successful
						var message = 'feedbacks fetching failed';
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
   * @function viewFeedback
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.viewFeedback =function(req, res , next) {
	
	var startDate = req.session.startDate;
	var endDate = req.session.lastRequestDate;
	var resource = "feedback";
	const feedbackID = req.params.id;
	
	try {		 
		var queryParams = {};	
		queryParams.id = feedbackID;	
		if (typeof req.body.previous  !== 'undefined' && req.body.previous  !== null && req.body.previous  !== "" ){
			queryParams.id = {[Op.lt]: feedbackID}
		}
		else if (typeof req.body.next  !== 'undefined' && req.body.next  !== null && req.body.next  !== "" ){				
			queryParams.id = {[Op.gt]: feedbackID}
		}
		
		dbLayer.feedback.findOne({
						where: queryParams,
						attributes : ['id','widget_id','screen_shot','createdAt'],
						include: [ 
							{
								model: dbLayer.widget,
								attributes : ['name','url']
							},	
							{
								model: dbLayer.feedback_answer,
								//attributes : ['answer'],
								include: [ 
									{
											model:dbLayer.widget_question,
											where:{},
											required: true,
											//attributes : ['option_id','limit'],
											include: [ 
												{
													model:dbLayer.question,
													where:{}
											}
										],												
									}
								],
							},
						],
				})
				.then( async function(feedback) {
					if (!feedback) {
						// catch error if the operation wasn't successful
						var message = 'Feedback fetching failed';
						var errors = {};
						return res.status(404).json(tools.errorResponseObj(errors,message,startDate,endDate,resource,req.url));
					} 

					var feedbacksObj = feedback.get();
					//feedbacksObj.id = feedbacksObj.id.toString()
					feedbacksObj.widget_id = feedbacksObj.widget_id.toString()
					feedbacksObj.name = feedbacksObj.widget.name
					feedbacksObj.url = feedbacksObj.widget.url
					feedbacksObj.date = tools.convertMillisecondsTodateFormat(feedbacksObj.createdAt);
					for(var j =0 ; j < feedbacksObj.feedback_answers.length;j++)
					{
						var answerObj = feedbacksObj.feedback_answers[j].get();
						var fieldName = answerObj.widget_question.question.name;
						if(fieldName == "Rate Us") {
							var optionID = answerObj.widget_question.option_id
							feedbacksObj.rating_type = (await dbLayer.question_option.findOne({where: {id: optionID},attributes : ['value']})).value;	
						}
						feedbacksObj[fieldName.replace(/\s/g, '')] = answerObj.answer
					}
					feedbacksObj.next = 0
					feedbacksObj.previous = 0
					var previousItem = await dbLayer.feedback.findOne({where: {id:{[Op.lt]: feedbackID}},attributes : ['id']})
					if(previousItem)
						feedbacksObj.previous = previousItem.id
						
					var NextItem = await dbLayer.feedback.findOne({where: {id:{[Op.gt]: feedbackID}},attributes : ['id']})
					if(NextItem)
						feedbacksObj.next = NextItem.id

					delete feedbacksObj.createdAt 
					delete feedbacksObj.widget 
					delete feedbacksObj.feedback_answers

					return res.status(200).json(tools.successResponseObj(feedbacksObj,startDate,endDate,resource,req.url));
					
					
				})
				.catch((error) => {		  
					// catch error if the operation wasn't successful
					var message = 'feedback fetching failed';
					return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				});
	}
	// catch error if the operation wasn't successful
	catch(error) {
		//console.log('The error log ' + error);
		var message = "operation wasn't successful";
		return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			 
	}
			
};


/**
   * @function deletefeedback
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.deletefeedback = [

		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),

		// Process request after validation and sanitization.
    async (req, res, next) => {
			var startDate = req.session.startDate;
			var endDate = req.session.lastRequestDate;
			var resource = "feedback";
			const feedbackID = req.params.id;
			dbLayer.feedback.destroy({
				where: {
				id: feedbackID,
			 }
			}).then(async () => {
				await dbLayer.feedback.destroy({where: {feedback_id: feedbackID}});
				return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
				
			})
			.catch((error) => {		  
				var message =  'feedback record failed';
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				
			});
	}

];
