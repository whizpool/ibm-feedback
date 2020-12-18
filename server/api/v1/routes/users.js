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
var userController = require('../controllers/userController');

router.post("/getAccessToken",userController.getAccessToken);
router.get("/",userController.fetchUsers);
router.post("/",userController.createUsers);
router.post("/",userController.updateUsers);
router.delete("/:id",userController.deleteUser);

module.exports = router;
 
