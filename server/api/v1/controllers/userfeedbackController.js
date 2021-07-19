/**
 * User Feedback controller for IBM feedback API
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: 9-Dec-2020
 * Last Updated: 25-Dec-2020
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
 
	// Process request after validation and sanitization.
    (req, res, next) => {

		var resource = "feedbacks";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			var message = 'Validation error from form inputs';
			var error = errors.array();
			return res.status(500).json(tools.errorResponseObj(error,message,resource,req.url));
		} else {
			try {	

				let requestParam = JSON.parse(Buffer.from(req.params.id, 'base64').toString())
				
				dbLayer.widget.findOne({
						where: {id:requestParam.id,url:requestParam.url,status:true},
						include: [ 
								{
									model:dbLayer.widget_question,
									attributes : ['id','widget_id','question_id','order','display_text','is_required','is_active','limit','option_id'],	
									include: [ 
												{
													model:dbLayer.question,
													attributes : ['type','name','form_key','display_text'],			
											},
									],	
								}
						],
						order: [[dbLayer.widget_question,'order', 'ASC']],
				})
				.then(async function(widgetData) {
					if (!widgetData) {				
						return res.status(200).json(tools.successResponseObj('<script>$("#ibmsnippet").html("");</script>',resource,req.url));				
					}  
					var widgetObj = widgetData.get();
					var widget_questions  = widgetObj.widget_questions;
					var feedbackWidget = ""
					if(widgetObj.type === 'feedback') {
						
						for(var i =0 ; i < widget_questions.length;i++)
						{							
							var questionObj = widget_questions[i].get();
							questionObj.rating_type = ""
							if(questionObj.display_text == ""){
								questionObj.display_text = questionObj.question.display_text
							}
							if(questionObj.option_id) {
								questionObj.rating_type = (await dbLayer.question_option.findOne({where: {id: questionObj.option_id,question_id:questionObj.question_id},attributes : ['value']})).value;	
							}
							if(questionObj.is_active){
								var questionHTML = createHTMLElement(questionObj)
								feedbackWidget += questionHTML+"<br/>"		
							}
						}
						
						var feedbackWidgetHTMLStr = '<header>Please fill out the following fields</header><section><form role="form" method="post" id="feedback_form"><input type="hidden" name="referral_url" id="referral_url" value="" /><input type="hidden" name="image" id="image" value="" />'+feedbackWidget+'<div style="width:100%"><div role="alert" kind="error" class="bx--inline-notification bx--inline-notification--error" style="max-width: inherit;width: inherit;"><div class="bx--inline-notification__text-wrapper"><div class="bx--inline-notification__subtitle"><span>&nbsp;&nbsp;&nbsp;A screenshot will be sent with your feedback</span></div></div></div></div><div style="width:100%"><button id="submitForm" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Submit Feedback</button></div></form></section><script>$("#referral_url").val(window.location.href);$("#feedback_form").submit(function(e){return e.preventDefault(),$.ajax({type:"POST",url:"'+config.apihost+'feedbacks/savefeedback/'+req.params.id+'",data:$(this).serialize(),beforeSend:function(){$("#widgetHTML").html("<div style=\'display: flex;justify-content: center;align-items: center;overflow: hidden\'><div data-loading class=\'bx--loading\'><svg class=\'bx--loading__svg\' viewBox=\'-75 -75 150 150\'><title>Loading</title><circle class=\'bx--loading__stroke\' cx=\'0\' cy=\'0\' r=\'37.5\' /></svg></div></div>")},success:function(e){$("#widgetHTML").html(e.data)}}),!1});</script>';

					}
					
			
					if(widgetObj.type === 'rating') {
						var ratingQuestion = {};
					var feedbackWidgetHTMLForm = {}
					var feedbackWidgetHTMLStr = "";
						
						for(var i =0 ; i < widget_questions.length;i++)
						{
							
							var questionObj = widget_questions[i].get();
							if(!questionObj.display_label){
								//
								//questionObj.rating_type = ""
								if(questionObj.question.form_key === "intro" && questionObj.is_active){
									questionObj.IntroText = questionObj.display_text
									if(questionObj.display_text == ""){
										questionObj.IntroText = questionObj.question.display_text
									}
									feedbackWidgetHTMLForm.intro =  '<div class="bx--form-item bx--text-input-wrapper"><p>'+questionObj.IntroText+'</p></div>';
				
								}

								if(questionObj.question.form_key === "rating" && questionObj.is_active){
										questionObj.display_text = ""									
									if(questionObj.option_id) {
											questionObj.rating_type = (await dbLayer.question_option.findOne({where: {id: questionObj.option_id,question_id:questionObj.question_id},attributes : ['value']})).value;	
										}
										if(questionObj.is_active){
											var questionHTML = createHTMLElement(questionObj)
											feedbackWidgetHTMLForm.rating= questionHTML+"<br/>"		
										}				
								}				
								//questionObj.rating_type = ""
								if(questionObj.question.form_key === "user_comment" && questionObj.is_active){
									var display_text = questionObj.display_text
									if(questionObj.display_text == "") {
										display_text = questionObj.question.display_text
									}
									feedbackWidgetHTMLForm.user_comment =  '<div class="bx--form-item bx--text-input-wrapper"><p>'+display_text+'</p></div>';				
								}
								
								if(questionObj.question.form_key === "response" && questionObj.is_active){
									var display_text = questionObj.display_text
									if(questionObj.display_text == "") {
										display_text = questionObj.question.display_text
									}
									feedbackWidgetHTMLForm.response =  display_text;				
								}
								
								if(questionObj.question.form_key === "feedback" && questionObj.is_active) {																
									if(questionObj.is_active){
										 var Options = questionObj;
											var elementID = "elementid_"+Options.id;										
											var questionHTML = '<div class="bx--form-item">'+
											'<label for="text-area-4" class="bx--label">##USERCOMMENT##</label>'+
											'<div class="bx--text-area__wrapper">'+
											'<textarea id="'+elementID+'"  name="'+elementID+'" '+ (Options.is_required ? "required" : "")+'  class="bx--text-area bx--text-area--invalid bx--text-area--v2"  rows="4" cols="50" ></textarea>'+
											'</div> </div>';
											feedbackWidgetHTMLForm.feedback = questionHTML;
										}					
								}							
							} 							
						}
						let feedbackLabel = feedbackWidgetHTMLForm.feedback;
						let feedbackLabelText = feedbackLabel.replace(	'##USERCOMMENT##' , feedbackWidgetHTMLForm.user_comment)
						let feedbackWidget = '<div id="ratingOptions" >'+ feedbackWidgetHTMLForm.intro +  feedbackWidgetHTMLForm.rating +" </div>";
							
						feedbackWidget += '<div id="feedbacktextarea" style="display:none">'+feedbackLabelText+'<div style="width:100%"><div role="alert" kind="error" class="bx--inline-notification bx--inline-notification--error" style="max-width: inherit;width: inherit;"><div class="bx--inline-notification__text-wrapper"><div class="bx--inline-notification__subtitle"><span>&nbsp;&nbsp;&nbsp;A screenshot will be sent with your feedback</span></div></div></div></div><div style="width:100%"><button id="submitForm" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Submit Feedback</button></div>';
						//feedbackWidget += 	feedbackWidgetHTMLForm.response;
			
						
						//questionObj.question.name
						var feedbackWidgetHTMLStr = '<section><form role="form" method="post" id="feedback_form"><input type="hidden" name="referral_url" id="referral_url" value="" /><input type="hidden" name="response" id="response" value="'+feedbackWidgetHTMLForm.response+'" /><input type="hidden" name="image" id="image" value="" />'+feedbackWidget+'</div></form></section><script>$("#referral_url").val(window.location.href);$("#feedback_form").submit(function(e){return e.preventDefault(),$.ajax({type:"POST",url:"'+config.apihost+'feedbacks/savefeedback/'+req.params.id+'",data:$(this).serialize(),beforeSend:function(){$("#widgetHTML").html("<div style=\'display: flex;justify-content: center;align-items: center;overflow: hidden\'><div data-loading class=\'bx--loading\'><svg class=\'bx--loading__svg\' viewBox=\'-75 -75 150 150\'><title>Loading</title><circle class=\'bx--loading__stroke\' cx=\'0\' cy=\'0\' r=\'37.5\' /></svg></div></div>")},success:function(e){$("#widgetHTML").html(e.data)}}),!1});$("#ratting-div input:radio").change(function() {$("#feedbacktextarea").show();$("#ratingOptions").hide()})</script>';
					}						
						
						
					return res.status(200).json(tools.successResponseObj(feedbackWidgetHTMLStr,resource,req.url));
					
					
				})
				.catch((error) => {		  
					var message = 'Widgets fetching failed';
					return res.status(500).json(tools.errorResponseObj(error.message,message,resource,req.url));					
				});     
			}
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,resource,req.url));
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
		var resource = "feedbacks";
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			var message = 'Validation error from form inputs';
			var error = errors.array();
			return res.status(500).json(tools.errorResponseObj(error,message,resource,req.url));
		} else {
			try {			
			
			
				let requestParam = JSON.parse(Buffer.from(req.params.id, 'base64').toString())				
				let ImageData= req.body.image;
				let response= req.body.response;
				let imageType= "image/jpeg"
				let ImageName = Date.now().toString();
				var objectStroageData = await objectStroage.UploadObject(ImageData,imageType,ImageName);
				var feedbackPostData = {
					widget_id: requestParam.id,
					screen_shot: ImageName,
					referral_url: (req.body.referral_url) ? req.body.referral_url : 'N/A',
				}
				
				let widgetType = (await dbLayer.widget.findOne({where: {id: requestParam.id},attributes : ['type']})).type;	
				var feedback = new dbLayer.feedback(feedbackPostData);	
				try {
						feedback.save({
							feedback
						}).then(async function(result) {
						var feedbackData = result.get();
						//Saveing Answers							
						for(let i=0;i<Object.keys(req.body).length;i++){
							let key = Object.keys(req.body)[i]
							if(key != "widget_id" && key != "image" && key != "referral_url" && key != "response") {
								var [_,wq_id] = key.split("_"); 								
								var feedbackAnswerData = {}
								feedbackAnswerData.feedback_id = feedbackData.id;	
								feedbackAnswerData.widget_question_id = parseInt(wq_id)
								feedbackAnswerData.answer = req.body[key]
								
								var feedbackAnswer = new dbLayer.feedback_answer(feedbackAnswerData);									
								await feedbackAnswer.save({feedbackAnswer});
							}
						}
						if(widgetType === 'rating') {							
								var feedbackWidgetHTMLStr = '<section>'+response+'</section>';						
						} else {
								var feedbackHTMLview = await viewUserFeedback(feedbackData.id);
								var feedbackWidgetHTMLStr = '<header>Thank you for submitting your feedback</header><section>'+feedbackHTMLview+'</section><div style="width:100%"><button id="dismiss" class="bx--btn bx--btn--primary" style="max-width: inherit;width: inherit;" type="submit">Dismiss</button></div><script>$("#dismiss").on("click",function(){$(".feedback-box").removeClass("show");});</script>';				
						}
					
						return res.status(200).json(tools.successResponseObj(feedbackWidgetHTMLStr,resource,req.url));
					})		
				}
				catch(error) {
					var message = "Error creating widget";
					return res.status(500).json(tools.errorResponseObj(error.message,message,resource,req.url));
				}	
			}     
			catch(error) {
				var message = "operation wasn't successful";
				return res.status(500).json(tools.errorResponseObj(error.message,message,resource,req.url));
			}
        }
    }
];



function createHTMLElement(Options) {
	
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
		case "string":		
			htmlElementStr = '<div class="bx--form-item">'+
				'<label for="text-area-4" class="bx--label">'+elementLabel+'</label>'+
				'<div class="bx--text-area__wrapper">'+
				'<textarea id="'+elementID+'"  name="'+elementID+'" '+ (Options.is_required ? "required" : "")+'  class="bx--text-area bx--text-area--invalid bx--text-area--v2" maxlength="'+Options.limit+'" rows="4" cols="50" placeholder="'+elementLabel+'"></textarea>'+
				'</div> </div>';
		break;
		case "select":			
			var htmlRatingStr = "";
			if(Options.question && Options.option_id > 0 ){
				htmlRatingStr = createUserRatingHTML(Options.rating_type,elementID);
			}
			htmlElementStr = '<div class="bx--form-item">'+
			'<label for="text-area-4" class="bx--label">'+elementLabel+'</label>'+
			'<div class="bx--text-area__wrapper">'+htmlRatingStr+
			'</div></div>';			
		break;
		case "multiline":	
		case "number":
		case "choice":
		break;
	}
	return htmlElementStr;	
}

function createUserRatingHTML(rating_type, elementID) {	
	var htmlRatingStr  = "";	
	switch(rating_type){
		case 'star':
			htmlRatingStr = '<div id="ratting-div" class="star_rating">'+
				'<input type="radio" id="star5" name="'+elementID+'"  value="5" /><label for="star5"></label>'+
				'<input type="radio" id="star4" name="'+elementID+'"  value="4" /><label for="star4"></label>'+
				'<input type="radio" id="star3" checked name="'+elementID+'"  value="3" /><label for="star3"></label>'+
				'<input type="radio" id="star2" name="'+elementID+'"  value="2" /><label for="star2"></label>'+
				'<input type="radio" id="star1" name="'+elementID+'"  value="1" /><label for="star1"></label>'+
				'</div>';
		break;		
		case 'stars':
			htmlRatingStr = '<div id="ratting-div" class="stars_rating">'+
				'<input type="radio" id="star5" name="'+elementID+'"  value="5" /><label for="star5"></label>'+
				'<input type="radio" id="star4" name="'+elementID+'"  value="4" /><label for="star4"></label>'+
				'<input type="radio" id="star3"  name="'+elementID+'"  value="3" /><label for="star3"></label>'+
				'<input type="radio" id="star2" name="'+elementID+'"  value="2" /><label for="star2"></label>'+
				'<input type="radio" id="star1" name="'+elementID+'"  value="1" /><label for="star1"></label>'+
				'</div>';
		break;	
		case 'number':
			htmlRatingStr = '<div id="ratting-div" class="number_rating">'+
				'<input type="radio" id="number5" class="number5" name="'+elementID+'" value="5" /><label class=" number_5_rating_label " for="number5"></label>'+
				'<input type="radio" id="number4"  class="number4" name="'+elementID+'" value="4" /><label class="number_4_rating_label " for="number4"></label>'+
				'<input type="radio" id="number3" checked class="number3" name="'+elementID+'"  value="3" /><label class="number_3_rating_label " for="number3"></label>'+
				'<input type="radio" id="number2"  class="number2" name="'+elementID+'"  value="2" /><label class="number_2_rating_label " for="number2"></label>'+
				'<input type="radio" id="number1"  class="number1" name="'+elementID+'" value="1" /><label class="number_1_rating_label " for="number1"></label>'+
				'</div>';
		break;		
		case 'numeric':
			htmlRatingStr = '<div id="ratting-div" class="number_rating">'+
				'<input type="radio" id="number10" class="number10" name="'+elementID+'" value="10" /><label class=" number_10_rating_label " for="number10"></label>'+
				'<input type="radio" id="number9" class="number9" name="'+elementID+'" value="9" /><label class=" number_9_rating_label " for="number9"></label>'+
				'<input type="radio" id="number8" class="number8" name="'+elementID+'" value="8" /><label class=" number_8_rating_label " for="number8"></label>'+
				'<input type="radio" id="number7" class="number7" name="'+elementID+'" value="7" /><label class=" number_7_rating_label " for="number7"></label>'+
				'<input type="radio" id="number6" class="number6" name="'+elementID+'" value="6" /><label class=" number_6_rating_label " for="number6"></label>'+
				'<input type="radio" id="number5" class="number5" name="'+elementID+'" value="5" /><label class=" number_5_rating_label " for="number5"></label>'+
				'<input type="radio" id="number4"  class="number4" name="'+elementID+'" value="4" /><label class="number_4_rating_label " for="number4"></label>'+
				'<input type="radio" id="number3" 	 class="number3" name="'+elementID+'"  value="3" /><label class="number_3_rating_label " for="number3"></label>'+
				'<input type="radio" id="number2"  class="number2" name="'+elementID+'"  value="2" /><label class="number_2_rating_label " for="number2"></label>'+
				'<input type="radio" id="number1"  class="number1" name="'+elementID+'" value="1" /><label class="number_1_rating_label " for="number1"></label>'+
				'</div>';
		break;	
		case 'thumbs':
			htmlRatingStr = '<div id="ratting-div" class="thumbs_rating">'+
				'<input type="radio" id="thumbs_down" class="thumbs_down" name="'+elementID+'" value="2" /><label class=" thumbs_down_rating_label " for="thumbs_down"></label>'+		
				'<input type="radio" id="thumbs_up" class="thumbs_up" name="'+elementID+'" value="1" /><label class=" thumbs_up_rating_label " for="thumbs_up"></label>'+
				'</div>';
		break;			
		case 'emoticons':
			htmlRatingStr = '<div id="ratting-div" class="emoticons_rating">'+
				'<input type="radio" id="face_activated" class="face_activated" name="'+elementID+'" value="5" /><label class="face_activated_rating_label " for="face_activated"></label>'+
				'<input type="radio" id="face_satisfied" class="face_satisfied" name="'+elementID+'" value="4" /><label class="face_satisfied_rating_label " for="face_satisfied"></label>'+		
				'<input type="radio" id="face_neutral" class="face_neutral" name="'+elementID+'" value="3" /><label class="face_neutral_rating_label " for="face_neutral"></label>'+		
					'<input type="radio" id="face_dissatisfied" class="face_dissatisfied" name="'+elementID+'" value="2" /><label class="face_dissatisfied_rating_label " for="face_dissatisfied"></label>'+	
				'<input type="radio" id="face_sad" class="face_sad" name="'+elementID+'" value="1" /><label class=" face_sad_rating_label " for="face_sad"></label>'+
				'</div>';
		break;	
		case 'smiley':
			htmlRatingStr = '<div id="ratting-div" class="smiley_rating">'+
				'<input type="radio" id="satisfied" class="satisfied" name="'+elementID+'"  value="3" /><label class="smiley_3_rating_label " for="satisfied"></label>'+
				'<input type="radio" id="neutral"  class="neutral" name="'+elementID+'"  value="2" /><label class="smiley_2_rating_label " for="neutral"></label>'+
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
			return res.status(404).json(tools.errorResponseObj(errors,message,resource,req.url));
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
		//var ObjectSignedUrl = await objectStroage.getObjectSignedUrl(feedbacksObj.screen_shot);
		var ObjectSignedUrl  = config.apihost+"widgets/download?file="+feedbacksObj.screen_shot;
		returnfeedbackView += "<img src='"+ObjectSignedUrl+"' style='height: 200px;width: 100%;' />"
		//Create Issues
		issueObj.body = issueBody + "<img src='"+ObjectSignedUrl+"' style='height: 200px;width: 100%;' />"
		
		slackObj.blocks.push({"type": "section","text": {"type": "mrkdwn","text": "Feed Back Image"},"accessory": {"type": "image",
	"image_url": ObjectSignedUrl,"alt_text": "Feedback Image"}})
		
		createIssuesOnConnection(widget_id, issueObj,slackObj)
		return returnfeedbackView;
		
	})
	.catch((error) => {		  
		return error;
	});			
};


function createHTMLViewElement(Options) {
	
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
	
	if(type === 'numeric') {
		
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
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral--filled.svg' style='width:30px' />"
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg' style='width:30px' />"
				break;
			case 3:
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied.svg' style='width:30px' />"
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg' style='width:30px' />"
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied--filled.svg' style='width:30px' />"
				break;
			default:
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--dissatisfied.svg' style='width:30px' />"
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--neutral.svg' style='width:30px' />"
				ratingHTML  += "<img src='"+config.ratingImageUrl+"face--satisfied.svg' style='width:30px' />"
				break;
		}						 
		
	}	

var ratingHTML = ""
	if(type === 'star') {
		for(var i =1 ; i <= 5;i++) {
			if(i <= value)
				ratingHTML  += "<img src='"+config.ratingImageUrl+"star--filled.svg' style='max-width:30px;width:30px' />"
			else
				ratingHTML  += "<img src='"+config.ratingImageUrl+"star.svg' style='max-width:30px;width:30px' />"
		}
	}		
	return ratingHTML;
}

function createIssuesOnConnection(widgetID, issueObj,slackObj) {
	
	var axios = require('axios');	
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
				//return res.status(200).json(tools.successResponseObj(result.data.resources,resource,req.url));
					
			})
			.catch(function (error) {
				//return res.status(400).json(tools.errorResponseObj(error,error.message,resource,req.url));
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
				//return res.status(200).json(tools.successResponseObj(result.data.resources,resource,req.url));						
			})
			.catch(function (error) {
				//return res.status(400).json(tools.errorResponseObj(error,error.message,resource,req.url));
				console.log(error)
			});
		}			
	})
	.catch((error) => {		  
		return error;
	});
	return true;				
	
}
