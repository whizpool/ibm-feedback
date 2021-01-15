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
var objectStroage = require('../../../modules/object_stroage');

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
				 
	/*console.log(req.body.filters)
					
					{
  name: 'sdfasdfas',
  url: 'ibm.com',
  rating: '2',
  rating_type: '3',
  start_date: '2021-01-15 00:00:00',
  end_date: '2021-01-15 00:00:00'
}	
*/
					var queryParams = {};	
					var widgetQueryParams = {};	
					var widgetQuestionQueryParams = {};	
					if (typeof req.body.filters  !== 'undefined' && req.body.filters  !== null && req.body.filters  !== "" ){
					var filters = req.body.filters;
					
					if (typeof filters.name  !== 'undefined' && filters.name  !== null && filters.name  !== "" ){							
							widgetQueryParams.name = { [Op.iLike]: '%'+filters.name+'%' }					
						}
						if (typeof filters.url  !== 'undefined' && filters.url  !== null && filters.url  !== "" ){							
							widgetQueryParams.url = { [Op.iLike]: '%'+filters.url+'%' }					
						}
						if (typeof filters.start_date  !== 'undefined' && filters.start_date  !== null && filters.start_date  !== "" && typeof filters.end_date  !== 'undefined' && filters.end_date  !== null && filters.end_date  !== "" ){
							
							fromDate = filters.start_date;
							toDate = filters.end_date;
							queryParams = {[Op.and]: [
                    dbLayer.sequelize.where(dbLayer.sequelize.fn('date', dbLayer.sequelize.col('feedback.createdAt')), '>=', fromDate),
                    dbLayer.sequelize.where(dbLayer.sequelize.fn('date', dbLayer.sequelize.col('feedback.createdAt')), '<=', toDate),
							]}
						}
						if (typeof filters.start_date  !== 'undefined' && filters.start_date  !== null && filters.start_date  !== "" ){
							fromDate = filters.start_date;
							queryParams = {[Op.and]: [
                    dbLayer.sequelize.where(dbLayer.sequelize.fn('date', dbLayer.sequelize.col('feedback.createdAt')), '>=', fromDate)                    
							]}
						}
						
						if (typeof filters.end_date  !== 'undefined' && filters.end_date  !== null && filters.end_date  !== "" ){
							toDate = filters.end_date;
							queryParams = {[Op.and]: [
            
                    dbLayer.sequelize.where(dbLayer.sequelize.fn('date', dbLayer.sequelize.col('feedback.createdAt')), '<=', toDate),
							]}
						}
						if (typeof filters.rating_type  !== 'undefined' && filters.rating_type  !== null && filters.rating_type  !== "" ){							
							//widgetQuestionQueryParams.option_id = +filters.url				
						}
					}					
			
					dbLayer.feedback.findAll({
							where: queryParams,
							attributes : ['id','widget_id','screen_shot','createdAt'],
							include: [ 
								{
									model: dbLayer.widget,
									attributes : ['name','url'],
									where:widgetQueryParams
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
																		[Op.or]: [{ [Op.iLike]: '%rate%'}, { [Op.iLike]: '%email%'}, { [Op.iLike]: '%Provide Feedback%'}]
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
						var RatingQuestionID = 0;
						var feedbacksList = []						
						for(var i =0 ; i < feedbacks.length;i++)
						{
							var feedbacksObj = feedbacks[i].get();
							feedbacksObj.id = feedbacksObj.id.toString()
							feedbacksObj.widget_id = feedbacksObj.widget_id.toString()
							feedbacksObj.name = feedbacksObj.widget.name
							feedbacksObj.url = feedbacksObj.widget.url
							feedbacksObj.date = tools.convertMillisecondsTodateFormat(feedbacksObj.createdAt);		 
							feedbacksObj.rating = 0;		 
							feedbacksObj.rating_type = "";		 
							feedbacksObj.ProvideFeedback = "";		 
							feedbacksObj.email = "";		 
							for(var j =0 ; j < feedbacksObj.feedback_answers.length;j++)
							{
								var answerObj = feedbacksObj.feedback_answers[j].get();
								var fieldName = answerObj.widget_question.question.name;
								if(fieldName == "Provide Feedback") {
									fieldName = 'ProvideFeedback'
								}
								if(fieldName == "Rate Us") {
									RatingQuestionID = answerObj.widget_question.question_id
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
						var userfeedbacks = {}
						userfeedbacks.list = feedbacksList;
						userfeedbacks.options = await dbLayer.question_option.findAll({where: {question_id: RatingQuestionID},attributes : ['id','label','value',]});	;
						return res.status(200).json(tools.successResponseObj(userfeedbacks,startDate,endDate,resource,req.url));
						
						
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
						order: [['id', 'DESC']],
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
					var ObjectSignedUrl = await objectStroage.getObjectSignedUrl(feedbacksObj.screen_shot);
					feedbacksObj.screen_shot = ObjectSignedUrl
					
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
					var previousItem = await dbLayer.feedback.findOne({where: {id:{[Op.lt]: feedbackID}},attributes : ['id'],order: [['id', 'DESC']]})
					if(previousItem)
						feedbacksObj.previous = previousItem.id
						
					var NextItem = await dbLayer.feedback.findOne({where: {id:{[Op.gt]: feedbackID}},attributes : ['id'],order: [['id', 'DESC']]})
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
				await dbLayer.feedback_answer.destroy({where: {feedback_id: feedbackID}});
				return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
				
			})
			.catch((error) => {		  
				var message =  'feedback record failed';
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				
			});
	}

];

/**
   * @function deleteAllFeedBacks
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.deleteAllFeedBacks = [

	 //body('message').isLength({ min: 1 }).trim().withMessage('Status must be specified.'),
   
    // Sanitize fields.
    //sanitizeBody('module').escape(),
	
	 // Process request after validation and sanitization.
    (req, res, next) => {
		
		//var startDate = tools.convertMillisecondsToStringDate(req.session.startDate);		
		//var endDate = tools.convertMillisecondsToStringDate(req.session.lastRequestDate);
		var startDate = req.session.startDate;
		var endDate = req.session.lastRequestDate;
		var resource = "chat";
		
		 // Extract the validation errors from a request.
    const errors = validationResult(req);
		const userData = req.body.userData;		
		//const messageID = req.params.id;
		
		if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/errors messages.
				var message = 'Validation error from form inputs';
				var error = errors.array();
				return res.status(500).json(tools.errorResponseObj(error,message,startDate,endDate,resource,req.url));           
		}		
		else {		
			var widget_id_list= [];
			if (typeof req.body.id  !== 'undefined' && req.body.id  !== null){
				if(tools.IsValidJSONString(req.body.id ) == true) {
					widget_id_list = JSON.parse(req.body.id )
				}
			}
			dbLayer.feedback.findAll({
				where: {id: {[Op.in]:widget_id_list}},
				 attributes : ['id']
			 }).then( async (feedbacks) => {
				
					var feedbackIDs_list = []
					for(var i =0 ; i < feedbacks.length;i++)
					{
						feedbackIDs_list.push(feedbacks[i].id)
					}
					
					if(feedbackIDs_list.length > 0 ){
						//Delete all feedback for this widget					
						await dbLayer.feedback_answer.destroy({where: {feedback_id:  {[Op.in]:feedbackIDs_list}}});
						await dbLayer.feedback.destroy({where: {id:  {[Op.in]:feedbackIDs_list}}});
					}
					
					return res.status(204).json(tools.successResponseObj([],startDate,endDate,resource,req.url));
				
			})
			.catch((error) => {		  
				var message =  'Widget record failed';
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
				
			});
			
	
		}

	}
];