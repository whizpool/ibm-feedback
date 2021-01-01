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
var objectStroage = require('../../../modules/object_stroage');
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
					/*	
					dbLayer.widget_question.findAll({
							where: {widget_id:req.body.id},
							attributes : ['id','widget_id','question_id','order','display_text','is_required','is_active','limit','option_id'],			
							include: [ 
													{
														model:dbLayer.question,
														attributes : ['type','name',],			
												},
									],
												
							order: [['order', 'ASC']],
					})*/
					dbLayer.widget.findOne({
							where: {id:req.body.id,url:req.body.url,status:true},
							include: [ 
									{
										model:dbLayer.widget_question,
										attributes : ['id','widget_id','question_id','order','display_text','is_required','is_active','limit','option_id'],	
										include: [ 
													{
														model:dbLayer.question,
														attributes : ['type','name',],			
												},
										],	
									}
							],
							order: [[dbLayer.widget_question,'order', 'ASC']],
					})
					.then(async function(widgetData) {
						if (!widgetData) {				
							return res.status(200).json(tools.successResponseObj([],startDate,endDate,resource,req.url));				
						}  
						var widgetObj = widgetData.get();
						var widget_questions  = widgetObj.widget_questions;
						
						var feedbackWidget = ""
						for(var i =0 ; i < widget_questions.length;i++)
						{
							
							var questionObj = widget_questions[i].get();
							questionObj.rating_type = ""
							if(questionObj.display_text == ""){
								questionObj.display_text = questionObj.question.name
							}
							if(questionObj.option_id) {
								questionObj.rating_type = (await dbLayer.question_option.findOne({where: {id: questionObj.option_id,question_id:questionObj.question_id},attributes : ['value']})).value;	
							}
							if(questionObj.is_active){
								var questionHTML = createHTMLElement(questionObj)
								feedbackWidget += questionHTML+"<br/>"		
							}
						} 
					
						var feedbackWidgetHTMLStr = '<header>Please fill out the following fields</header><section><form role="form" method="post" id="feedback_form"><input type="hidden" id="widget_id" name="widget_id" /><input type="hidden" name="image" id="image" value="" />'+feedbackWidget+'<div style="width:100%"><div role="alert" kind="error" class="bx--inline-notification bx--inline-notification--error" style="max-width: inherit;width: inherit;"><div class="bx--inline-notification__text-wrapper"><div class="bx--inline-notification__subtitle"><span>&nbsp;&nbsp;&nbsp;A screenshot will be sent with your feedback</span></div></div></div></div><div style="width:100%"><button id="submitForm" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Submit Feedback</button></div></form></section><script>html2canvas(document.body).then(function(e){document.getElementById("image").value=e.toDataURL("image/jpeg",.9),$("#feedback_form").submit(function(e){e.preventDefault();var a=$(this);return $.ajax({type:"POST",url:"'+config.apihost+'feedbacks/savefeedback",data:a.serialize(),beforeSend:function(){$("#widgetHTML").html("<div style=\'display: flex;justify-content: center;align-items: center;overflow: hidden\'><div data-loading class=\'bx--loading\'><svg class=\'bx--loading__svg\' viewBox=\'-75 -75 150 150\'><title>Loading</title><circle class=\'bx--loading__stroke\' cx=\'0\' cy=\'0\' r=\'37.5\' /></svg></div></div>")},success:function(e){$("#widgetHTML").html(e.data)}}),!1})});</script>';
				
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
					let ImageData= req.body.image;
					let imageType= "image/jpeg"
					let ImageName = Date.now().toString();
					var objectStroageData = await objectStroage.UploadObject(ImageData,imageType,ImageName);					
								
					var feedbackPostData = {
						widget_id: req.body.widget_id,
						screen_shot: ImageName,
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
								if(key != "widget_id" && key != "image") {
								var [_,wq_id] = key.split("_"); 								
								var feedbackAnswerData = {}
								feedbackAnswerData.feedback_id = feedbackData.id;	
									feedbackAnswerData.widget_question_id = parseInt(wq_id)
								feedbackAnswerData.answer = req.body[key]
									var feedbackAnswer = new dbLayer.feedback_answer(feedbackAnswerData);									
									await feedbackAnswer.save({feedbackAnswer});
								}
							}						
							
							var feedbackHTMLview = await viewUserFeedback(feedbackData.id);
								
							var feedbackWidgetHTMLStr = '<header>Thank you for submitting your feedback</header><section>'+feedbackHTMLview+'</section><div style="width:100%"><button id="dismiss" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Dismiss</button></div><script>$("#dismiss").on("click",function(){$(".feedback-box").removeClass("show");});</script>';			
					
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
	
	var elementLabel = Options.display_text;
	var elementPlaceHolder = Options.display_text;
	
	var elementID = "elementid_"+Options.id;
	var name = Options.question.name;
	//var email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
	var addPattern = ""
	var type = "text"
	if(name === "Email Address") {
		type = "email"
		addPattern ="[a-zA-Z0-9.!#$%&amp;’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+"
	}
	switch( Options['question']['type']) {
		case "singleline":
				htmlElementStr = '<div class="bx--form-item bx--text-input-wrapper"> '+
													'<label for="text-input-3" class="bx--label">'+elementLabel+'</label>'+
													'<div class="bx--text-input__field-wrapper">'+
													'<input id="'+elementID+'" '+( addPattern ? 'pattern ="'+addPattern+'"'  : '' )+' name="'+elementID+'" type="'+type+'" class="bx--text-input" placeholder="'+elementPlaceHolder+'" '+ (Options.is_required ? "required" : "")+' >'+
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
															'<textarea id="'+elementID+'"  name="'+elementID+'" '+ (Options.is_required ? "required" : "")+'  class="bx--text-area bx--text-area--invalid bx--text-area--v2" maxlength="'+Options.limit+'" rows="4" cols="50" placeholder="'+elementLabel+'"></textarea>'+
														'</div> </div>'

				break;
		case "select":
					var htmlRatingStr = "";
					if(Options.question && Options.option_id > 0 ){
						htmlRatingStr = createUserRatingHTML(Options.rating_type,elementID);
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
			htmlRatingStr = '<div id="ratting-div" class="start_rating">'+
												'<input type="radio" id="star5" name="'+elementID+'"  value="5" /><label for="star5"></label>'+
												'<input type="radio" id="star4" name="'+elementID+'"  value="4" /><label for="star4"></label>'+
												'<input type="radio" id="star3" checked name="'+elementID+'"  value="3" /><label for="star3"></label>'+
												'<input type="radio" id="star2" name="'+elementID+'"  value="2" /><label for="star2"></label>'+
												'<input type="radio" id="star1" name="'+elementID+'"  value="1" /><label for="star1"></label>'+
										'</div>';
				break;	
		case 'number':
			htmlRatingStr = '<div id="ratting-div" class="number_rating">'+
														'<input type="radio" id="number5" class="number5" name="'+elementID+'" value="5" /><label class=" number_5_rating_label " for="number5"></label>'+
														'<input type="radio" id="number4" class="number4" name="'+elementID+'" value="4" /><label class="number_4_rating_label " for="number4"></label>'+
														'<input type="radio" id="number3" checked class="number3" name="'+elementID+'"  value="3" /><label class="number_3_rating_label " for="number3"></label>'+
														'<input type="radio" id="number2" class="number2" name="'+elementID+'"  value="2" /><label class="number_2_rating_label " for="number2"></label>'+
														'<input type="radio" id="number1" class="number1" name="'+elementID+'" value="1" /><label class="number_1_rating_label " for="number1"></label>'+
											'</div>';
				break;	
		case 'smiley':
				htmlRatingStr = '<div id="ratting-div" class="smiley_rating">'+
												'<input type="radio" id="satisfied" class="satisfied" name="'+elementID+'"  value="3" /><label class="smiley_3_rating_label " for="satisfied"></label>'+
												'<input type="radio" id="neutral" checked class="neutral" name="'+elementID+'"  value="2" /><label class="smiley_2_rating_label " for="neutral"></label>'+
												'<input type="radio" id="dissatisfied" class="dissatisfied" name="'+elementID+'" value="1" /><label class="smiley_1_rating_label " for="dissatisfied"></label>'+
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
								include: [ 
									{
											model:dbLayer.widget_question,
											include: [ 
												{
													model:dbLayer.question,
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
					var issueObj = {}
					var slackObj = {}
					slackObj.blocks = []
					var issueBody = ""
					var returnfeedbackView = ""
						
					var feedbacksObj = feedback.get();
					let widget_id = feedbacksObj.widget_id;
					for(var j =0 ; j < feedbacksObj.feedback_answers.length;j++)
					{
						var answerObj = feedbacksObj.feedback_answers[j].get();
						var fieldName = answerObj.widget_question.question.name;
						var fieldtype = answerObj.widget_question.question.type;
						var ratingType = "";
						if(fieldName == "Rate Us") {
							var optionID = parseInt(answerObj.widget_question.option_id)
							ratingType = (await dbLayer.question_option.findOne({where: {id: optionID},attributes : ['value']})).value;	
						}					
					
						var Options = {}
						Options['type'] = fieldtype
						Options['name'] = fieldName
						Options['answer'] = answerObj.answer
						Options['rating_type'] = ratingType
						var htmlElement = createHTMLViewElement(Options)						
						returnfeedbackView += htmlElement					
						if(fieldName == "Name") {
								issueObj.title = answerObj.answer + " submitted a feedback."; 
								slackObj.text = answerObj.answer + " submitted a feedback."; 
						} 
						if(fieldName != "Rate Us") {
							issueBody += htmlElement							
							slackObj.blocks.push({"type": "section","fields": [{"type": "mrkdwn","text": "*"+fieldName+"*\n"+answerObj.answer}]}
							)
					}
					
					}
					var ObjectSignedUrl = await objectStroage.getObjectSignedUrl(feedbacksObj.screen_shot);
					returnfeedbackView += "<img src='"+ObjectSignedUrl+"' style='height: 200px;width: 100%;' />"
					//feedbackView += "<img src='http://localhost:3000/assets/RE4wB5e.jpg' style='height: 200px' />"
					//Create Issues
					issueObj.body = issueBody + "<img src='"+ObjectSignedUrl+"' style='height: 200px;width: 100%;' />"
					
					slackObj.blocks.push({"type": "section","text": {"type": "mrkdwn","text": "Feed Back Image"},"accessory": {"type": "image",
				"image_url": ObjectSignedUrl,"alt_text": "Feedback Image"}})
					
					await createIssuesOnConnection(widget_id, issueObj,slackObj)
							
					return returnfeedbackView;
					
					
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
					  ratingHTML  += "<img src='"+config.ratingImageUrl+"star--filled.svg' style='max-width:30px;width:30px' />"
				else
					ratingHTML  += "<img src='"+config.ratingImageUrl+"star.svg' style='max-width:30px;width:30px' />"
			}
		}	
		if(type === 'number') {
			
			switch(parseInt(value)) {
				case 1:					
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--5.svg' style='width:30px' />"
					 
					break;
				case 2:
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--5.svg' style='width:30px' />"
					
					break;	
				case 3:
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--5.svg' style='width:30px' />"	
					break;
				case 4:
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--5.svg' style='width:30px' />"	
					break;
				case 5:
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--1.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--2.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--3.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--4.svg' style='width:30px' />"
					ratingHTML  += "<img src='"+config.ratingImageUrl+"number--5.svg' style='width:30px' />"	
					break;
				 default:
						ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--1.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--2.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--3.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--4.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"number--small--5.svg' style='width:30px' />"
				 break;	
			}
		}

		if(type === 'smiley') {
				
				switch(parseInt(value)) {
					case 1:
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied--filled.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg' style='width:30px' />"
						break;	
					case 2:
							ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg--filled' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg' style='width:30px' />"
							break;
					 case 3:
							ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied--filled.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg--filled' style='width:30px' />"
							break;
					 default:
							ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg' style='width:30px' />"
						ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg' style='width:30px' />"
						 break;
				}						 
			
		}		
		return ratingHTML;
}

function createIssuesOnConnection(widgetID, issueObj,slackObj) {
	
		var axios = require('axios');
		/*
			github_api_url : req.body.api_url,
			github_response : req.body.api_response,
			personal_access_token : req.body.pac,
			repo_id : req.body.repo_id,
			repo_name : req.body.repo_name,
			repo_owner : req.body.repo_owner,
			repo_url : req.body.repo_url,
			is_github_connected : true
			*/
		//var widgetConnection = (await dbLayer.widget_connection.findOne({where: {widget_id: req.body.widget_id}}));	
		
		dbLayer.widget_connection.findOne({
				where: {widget_id: widgetID}
		})
		.then( async function(widgetObj) {
			
			var connectioObj = widgetObj.get();
			if(connectioObj.is_github_connected) {
				
				let gitHubURL = connectioObj.github_api_url+'/repos/'+connectioObj.repo_owner+'/'+connectioObj.repo_name+'/issues';				
				const params = {
							title: issueObj.title,
							body: issueObj.body,
				};	
				var config = {
							method: 'post',
							url: gitHubURL,
							headers: { 
								'Authorization': 'Bearer '+connectioObj.personal_access_token,
								'Content-Type': `application/vnd.github.baptiste-preview+json`
							},
							data:JSON.stringify(params)
					};
					await axios(config)
						.then(function (result) {
							console.log(result)
							//return res.status(200).json(tools.successResponseObj(result.data.resources,startDate,endDate,resource,req.url));
							
					})
					.catch(function (error) {
						//return res.status(400).json(tools.errorResponseObj(error,error.message,startDate,endDate,resource,req.url));
						console.log(error)
				});
			
			}
			
			if(connectioObj.is_slack_connected) {
				let webhook = connectioObj.webhook
				//slackObj
				
				var config = {
							method: 'post',
							url: webhook,							
							//data:JSON.stringify(slackObj)
							data:slackObj
					};
					await axios(config)
						.then(function (result) {
							console.log(result)
							//return res.status(200).json(tools.successResponseObj(result.data.resources,startDate,endDate,resource,req.url));
							
					})
					.catch(function (error) {
						//return res.status(400).json(tools.errorResponseObj(error,error.message,startDate,endDate,resource,req.url));
						console.log(error)
				});
			}
				
				
			
		})
		.catch((error) => {		  
			return error;
		});
	
	
		return true;
					
	
}