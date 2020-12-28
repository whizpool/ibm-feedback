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
   * @function fetchUserFeedbackWidget
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.fetchUserFeedbackWidget = [
 
		body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
		body('url').isLength({ min: 1 }).trim().withMessage('URL must be specified.'),
   
    // Sanitize fields.
    sanitizeBody('id').escape(),
		
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
				 
					dbLayer.widget_question.findAll({
							where: {widget_id:req.body.id},
							attributes : ['id','widget_id','question_id','order','display_text','is_required','is_active','limit','option_id'],			
							include: [ 
													{
														model:dbLayer.question,
														attributes : ['type'],			
														where:{}
												}
									],
												
							order: [['order', 'ASC']],
					})
					
					.then(async function(questions) {
						if (!questions) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var feedbackWidget = ""
						for(var i =0 ; i < questions.length;i++)
						{
							
							var questionObj = questions[i].get();
							questionObj.rating_type = ""
							/*questionObj.widget_id = questionObj.widget_id.toString()
							questionObj.question_id = questionObj.question_id
							questionObj.display_text_value = questionObj.display_text
							questionObj.is_required = questionObj.is_required
							questionObj.is_active = questionObj.is_active
							questionObj.limit = questionObj.limit
							questionObj.option_id = (questionObj.option_id) ? questionObj.option_id : "0"										
							*/
							if(questionObj.option_id) {
								questionObj.rating_type = (await dbLayer.question_option.findOne({where: {id: questionObj.option_id},attributes : ['value']})).value;	
							}
							if(questionObj.is_active){
								var questionHTML = createHTMLElement(questionObj)
								feedbackWidget += questionHTML+"<br/>"		
							}
						} 
					
						var feedbackWidgetHTMLStr = '<header>Please fill out the following fields</header><section><form role="form" method="post" id="feedback_form"><input type="hidden" id="widget_id" name="widget_id" />'+feedbackWidget+'<div style="width:100%"><div role="alert" kind="error" class="bx--inline-notification bx--inline-notification--error" style="max-width: inherit;width: inherit;"><div class="bx--inline-notification__text-wrapper"><div class="bx--inline-notification__subtitle"><span>&nbsp;&nbsp;&nbsp;A screenshot will be sent with your feedback</span></div></div></div></div><div style="width:100%"><button id="submitForm" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Submit Feedback</button></div></form></section><script>$("#feedback_form").submit(function(e){e.preventDefault();var a=$(this);return $.ajax({type:"POST",url:BaseUrl+"/savefeedback",data:a.serialize(),success:function(e){$("#widgetHTML").html(e.data);}}),!1});</script>';
							
				
						//return res.status(200).json(tools.successResponseObj(feedbackWidget,startDate,endDate,resource,req.url));
						return res.status(200).json(tools.successResponseObj(feedbackWidgetHTMLStr,startDate,endDate,resource,req.url));
						
						
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
   * @function saveUserFeedbackData
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Object} response object
   * @description gets all available results
*/
exports.saveUserFeedbackData = [
 
		//body('id').isLength({ min: 1 }).trim().withMessage('ID must be specified.'),
		//body('url').isLength({ min: 1 }).trim().withMessage('URL must be specified.'),
   
    // Sanitize fields.
    //sanitizeBody('id').escape(),
		
    // Process request after validation and sanitization.
   async (req, res, next) => {

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
					//var feedbackData = await viewUserFeedback(1);
					
					//var feedbackWidgetHTMLStr = '<header>Thank you for submitting your feedback</header><section>'+feedbackData+'</section><div style="width:100%"><button id="dismiss" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Dismiss</button></div><script>$("#dismiss").on("click",function(){$(".feedback-box").removeClass("show");});</script>';
					
					
					return res.status(200).json(tools.successResponseObj(feedbackWidgetHTMLStr,startDate,endDate,resource,req.url));
				
					var feedbackPostData = {
						widget_id: req.body.widget_id,
						screen_shot: 'http://localhost:3000/assets/RE4wB5e.jpg',
					}
					
					var feedback = new dbLayer.feedback(feedbackPostData);	
					try {
							feedback.save({
								feedback
							}).then(async function(result) {
							var feedbackData = result.get();
							//Saveing Answers							
					
							for(let i=0;i<Object.keys(req.body).length;i++){
								let key = Object.keys(req.body)[i]
								var [_,wq_id] = key.split("_"); 								
								var feedbackAnswerData = {}
								feedbackAnswerData.feedback_id = feedbackData.id;	
								feedbackAnswerData.widget_question_id = wq_id
								feedbackAnswerData.answer = req.body[key]
								
								var feedback_answer = new dbLayer.feedback_answer(feedbackAnswerData);									
								feedback_answer.save({feedback_answer});
							}
							var feedbackWidgetHTMLStr = '<header>Thank you for submitting your feedback</header><section>'+feedbackData+'</section><div style="width:100%"><button id="dismiss" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Dismiss</button></div><script>$("#dismiss").on("click",function(){$(".feedback-box").removeClass("show");});</script>';			
					
								return res.status(200).json(tools.successResponseObj(feedbackWidgetHTMLStr,startDate,endDate,resource,req.url));
						})		
					}
					catch(error) {
						//console.log('The error log ' + error);
						var message = "Error creating widget";
						return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
					}
					
					
					//return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));   
				}     
			// catch error if the operation wasn't successful
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,startDate,endDate,resource,req.url));
			}
        }
    }
];



function createHTMLElement(Options) {
	//'string', 'singleline','multiline','number','select','choice'
	
	var htmlElementStr  = "";
	
	var elementLabel = Options['display_text'];
	var elementPlaceHolder = Options['display_text'];
	var elementID = Options['id'];

	switch( Options['question']['type']) {
		case "singleline":
				htmlElementStr = '<div class="bx--form-item bx--text-input-wrapper"> '+
													'<label for="text-input-3" class="bx--label">'+elementLabel+'</label>'+
													'<div class="bx--text-input__field-wrapper">'+
													'<input id="elementid_'+elementID+'" name="elementid_'+elementID+'" type="text" class="bx--text-input" placeholder="'+elementPlaceHolder+'" '+ (Options['is_required'] ? "required" : "")+ '>'+
													'</div></div>';
				break;								
		case "multiline":
				break;
		case "number":
				break;
		case "string":		
					htmlElementStr = '<div class="bx--form-item">'+
														'<label for="text-area-4" class="bx--label">'+elementLabel+'</label>'+														
														'<div class="bx--text-area__wrapper">'+
															'<textarea id="elementid_'+elementID+'"  name="elementid_'+elementID+'" class="bx--text-area bx--text-area--invalid bx--text-area--v2" maxlength="'+Options['limit']+'" rows="4" cols="50" placeholder="'+elementLabel+'"></textarea>'+
														'</div> </div>'

				break;
		case "select":
					var htmlRatingStr = "";
					if(Options['question'] && Options['option_id'] > 0 ){
						htmlRatingStr = createUserRatingHTML(Options['rating_type'],elementID);
					}
					
						htmlElementStr = '<div class="bx--form-item">'+
														'<label for="text-area-4" class="bx--label">'+elementLabel+'</label>'+														
														'<div class="bx--text-area__wrapper">'+htmlRatingStr+
														'</div></div>'
														
														
				break;
		case "choice":		
				break;
									
												
	}
	
	return htmlElementStr;
	
}

function createUserRatingHTML(rating_type, elementID){
	
	var htmlRatingStr  = "";
	
	switch(rating_type){
		case 'star':
			htmlRatingStr = '<div class="start_rating">'+
												'<input type="radio" id="star5" name="elementid_'+elementID+'"  value="5" /><label for="star5"></label>'+
												'<input type="radio" id="star4" name="elementid_'+elementID+'"  value="4" /><label for="star4"></label>'+
												'<input type="radio" id="star3" name="elementid_'+elementID+'"  value="3" /><label for="star3"></label>'+
												'<input type="radio" id="star2" name="elementid_'+elementID+'"  value="2" /><label for="star2"></label>'+
												'<input type="radio" id="star1" name="elementid_'+elementID+'"  value="1" /><label for="star1"></label>'+
										'</div>';
				break;	
		case 'smiley':
			htmlRatingStr = '<div class="number_rating">'+
														'<input type="radio" id="number5" class="number5" name="elementid_'+elementID+'" value="5" /><label class=" number_5_rating_label " for="number5"></label>'+
														'<input type="radio" id="number4" class="number4" name="elementid_'+elementID+'" value="4" /><label class="number_4_rating_label " for="number4"></label>'+
														'<input type="radio" id="number3" class="number3" name="elementid_'+elementID+'"  value="3" /><label class="number_3_rating_label " for="number3"></label>'+
														'<input type="radio" id="number2" class="number2" name="elementid_'+elementID+'"  value="2" /><label class="number_2_rating_label " for="number2"></label>'+
														'<input type="radio" id="number1" class="number1" name="elementid_'+elementID+'" value="1" /><label class="number_1_rating_label " for="number1"></label>'+
											'</div>';
				break;	
		case 'number':
				htmlRatingStr = '<div class="smiley_rating">'+
												'<input type="radio" id="satisfied" class="satisfied" name="elementid_'+elementID+'"  value="3" /><label class="smiley_3_rating_label " for="satisfied"></label>'+
												'<input type="radio" id="neutral" class="neutral" name="elementid_'+elementID+'"  value="2" /><label class="smiley_2_rating_label " for="neutral"></label>'+
												'<input type="radio" id="dissatisfied" class="dissatisfied" name="elementid_'+elementID+'" value="1" /><label class="smiley_1_rating_label " for="dissatisfied"></label>'+
										'</div>';
				break;	
		
	}
	return htmlRatingStr;
	
}



function viewUserFeedback(feedbackID) {
	
		
		return dbLayer.feedback.findOne({
						where: {id: feedbackID},
						attributes : ['id','widget_id','screen_shot','createdAt'],
						include: [ 
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
						order: dbLayer.sequelize.literal('"feedback_answers->widget_question"."order" ASC')
				})
				.then( async function(feedback) {
					if (!feedback) {
						// catch error if the operation wasn't successful
						var message = 'Feedback fetching failed';
						var errors = {};
						return res.status(404).json(tools.errorResponseObj(errors,message,startDate,endDate,resource,req.url));
					} 
					var feedbackView = ""
						
					var feedbacksObj = feedback.get();
				
					for(var j =0 ; j < feedbacksObj.feedback_answers.length;j++)
					{
						var answerObj = feedbacksObj.feedback_answers[j].get();
						var fieldName = answerObj.widget_question.question.name;
						var fieldtype = answerObj.widget_question.question.type;
						var ratingType = "";
						if(fieldName == "Rate Us") {
							var optionID = answerObj.widget_question.option_id
							ratingType = (await dbLayer.question_option.findOne({where: {id: optionID},attributes : ['value']})).value;	
						}
					
						var Options = {}
						Options['type'] = fieldtype
						Options['name'] = fieldName
						Options['answer'] = answerObj.answer
						Options['rating_type'] = ratingType
						feedbackView += createHTMLViewElement(Options)
					}
					feedbackView += "<img src='"+feedbacksObj.screen_shot+"' style='height: 200px' />"
					
					return feedbackView;
					
					
				})
				.catch((error) => {		  
					return error;
				});
	
			
};


function createHTMLViewElement(Options) {
	//'string', 'singleline','multiline','number','select','choice'
	
	var htmlElementStr  = "";
	
	var elementLabel = Options['name'];
	var elementValue = Options['answer'];
	console.log(Options['type'])
	switch( Options['type']) {
		case "singleline":
		case "multiline":
		case "number":
		case "string":		
				htmlElementStr = '<div class="bx--form-item bx--text-input-wrapper"> '+
													'<h5 style="font-weight: bold;">'+elementLabel+'</h5>'+
													'<div style="margin: 10px 0px; font-size: 15px;">'+elementValue+'</div></div><br>';
				break;
		case "select":
					if( Options['rating_type'] != "" ){
					
					htmlElementStr = '<div class="bx--form-item bx--text-input-wrapper"> '+
													'<h5 style="font-weight: bold;">'+elementLabel+'</h5>'+
													'<div style="margin: 10px 0px; font-size: 15px;">'+createRatingView( Options['rating_type'],elementValue)+'</div></div><br>';
					}
					/*
					if(Options['question'] && Options['rating_type'] > 0 ){
						htmlRatingStr = createUserRatingHTML(Options['rating_type'],elementID);
					}
					
						htmlElementStr = '<div class="bx--form-item">'+
														'<label for="text-area-4" class="bx--label">'+elementLabel+'</label>'+														
														'<div class="bx--text-area__wrapper">'+htmlRatingStr+
														'</div></div>'
					*/													
														
				break;
		
									
												
	}
	
	return htmlElementStr;
	
}

function createRatingView(type, value) {
	var ratingHTML = ""
	if(type === 'star') {
			for(var i =1 ; i <= 5;i++) {
				if(i <= value)
					  ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/star--filled.svg' style='width:30px' />"
				else
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/star.svg' style='width:30px' />"
			}
		}	
		if(type === 'number') {
			
			switch(parseInt(value)) {
				case 1:					
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--5.svg' style='width:30px' />"
					 
					break;
				case 2:
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--5.svg' style='width:30px' />"
					
					break;	
				case 3:
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--5.svg' style='width:30px' />"	
					break;
				case 4:
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--5.svg' style='width:30px' />"	
					break;
				case 5:
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--5.svg' style='width:30px' />"	
					break;
				 default:
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--1.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--2.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--3.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--4.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/number--small--5.svg' style='width:30px' />"
				 break;	
			}
		}

		if(type === 'smiley') {
				
				switch(parseInt(value)) {
					case 1:
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--dissatisfied--filled.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--satisfied.svg' style='width:30px' />"
						break;	
					case 2:
							ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--dissatisfied.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--neutral.svg--filled' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--satisfied.svg' style='width:30px' />"
							break;
					 case 3:
							ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--dissatisfied--filled.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--satisfied.svg--filled' style='width:30px' />"
							break;
					 default:
							ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--dissatisfied.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='https://inapp-feedback.doctors-finder.com/assets/face--satisfied.svg' style='width:30px' />"
						 break;
				}						 
			
		}		
		return ratingHTML;
		
}
