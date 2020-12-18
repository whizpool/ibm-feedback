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
var widgetController = require('../controllers/widgetController');

router.get("/",widgetController.fetchWidgets);
router.get("/:id",widgetController.getWidget);
router.post("/",widgetController.createWidgets);
router.post("/status",widgetController.updateWidgetsStatus);
router.post("/update/:id",widgetController.updateWidget);
router.delete("/:id",widgetController.deleteWidget);
router.post("/question",widgetController.getWidgetQuestions);
router.post("/update_question",widgetController.UpdateWidgetQuestions);
router.post("/github/:id",widgetController.SaveGitHubConnection);
router.post("/unlink_connection/:id",widgetController.unlinkConnection);
router.post("/slack/:id",widgetController.SaveSlackConnection);

module.exports = router;
 
