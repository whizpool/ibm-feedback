/**
 * Database feedback model.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: ‎09-Dec-2020
 * Last Updated: 24-Jan-2021
*/

/**
 * Module dependencies.
*/
var express = require('express');
var router = express.Router();
var feedbackController = require('../controllers/feedbackController');
const Authorize = require("../../../modules/Authorize");

router.post("/", Authorize.verifyToken, feedbackController.fetchFeedbacks);
router.post("/:id", Authorize.verifyToken, feedbackController.viewFeedback);
router.delete("/:id", Authorize.verifyToken, feedbackController.deletefeedback);
router.post("/delete_feedbacks", Authorize.verifyToken, feedbackController.deleteAllFeedBacks);

//userfeedbackController
var userfeedbackController = require('../controllers/userfeedbackController');
router.post("/savefeedback/:id", userfeedbackController.saveUserFeedbackData);
router.post("/getmywidget/:id", userfeedbackController.fetchUserFeedbackWidget);


module.exports = router;
 
