/**
 * Database widgets model.
 * Author: Whizpool.
 * Version: 1.0.0
 * Release Date: ‎09-Dec-2020
 * Last Updated: 09-Dec-2020
 */

/**
 * Module dependencies.
*/
var express = require('express');
var router = express.Router();
var feedbackController = require('../controllers/feedbackController');

router.get("/",feedbackController.fetchFeedbacks);
router.get("/:id",feedbackController.viewFeedback);
router.delete("/:id",feedbackController.deletefeedback);
//router.post("/",feedbackController.createUsers);
//router.post("/",feedbackController.updateUsers);
//

module.exports = router;
 
