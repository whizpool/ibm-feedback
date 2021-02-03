/**
 * Database widgets model.
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
var widgetController = require('../controllers/widgetController');

const Authorize = require("../../../modules/Authorize");

router.get("/download", widgetController.getDownloadUrl);
router.get("/", Authorize.verifyToken, widgetController.fetchWidgets);
router.get("/:id", Authorize.verifyToken, widgetController.getWidget);
router.post("/", Authorize.verifyToken, widgetController.createWidgets);
router.post("/status", Authorize.verifyToken, widgetController.updateWidgetsStatus);
router.post("/update/:id", Authorize.verifyToken, widgetController.updateWidget);
router.delete("/:id", Authorize.verifyToken, widgetController.deleteWidget);
router.post("/question", Authorize.verifyToken, widgetController.getWidgetQuestions);
router.post("/update_question", Authorize.verifyToken, widgetController.UpdateWidgetQuestions);
router.post("/github/:id", Authorize.verifyToken, widgetController.SaveGitHubConnection);
router.post("/unlink_connection/:id", Authorize.verifyToken, widgetController.unlinkConnection);
router.post("/slack/:id", Authorize.verifyToken, widgetController.SaveSlackConnection);
router.post("/deleta_widgets", Authorize.verifyToken, widgetController.DeleteWidgets);


module.exports = router;
 
