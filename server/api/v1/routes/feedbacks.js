/**
 * Database feedback model.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: ‎09-Dec-2020
 * Last Updated: 24-Dec-2020
 */

/**
 * Module dependencies.
*/
var express = require('express');
var router = express.Router();
var feedbackController = require('../controllers/feedbackController');
const Authorize = require("../../../modules/Authorize");

router.get("/",Authorize.verifyToken,feedbackController.fetchFeedbacks);
router.get("/:id",Authorize.verifyToken,feedbackController.viewFeedback);
router.delete("/:id",Authorize.verifyToken,feedbackController.deletefeedback);

//userfeedbackController

var userfeedbackController = require('../controllers/userfeedbackController');
router.post("/savefeedback",userfeedbackController.saveUserFeedbackData);
router.post("/getmywidget",userfeedbackController.fetchUserFeedbackWidget);

module.exports = router;
 
