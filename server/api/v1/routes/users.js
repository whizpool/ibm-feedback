/**
 * Database user model.
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
var userController = require('../controllers/userController');

const Authorize = require("../../../modules/Authorize");
router.post("/login", userController.UserVerifyFromIBM);
router.post("/", Authorize.verifyToken, userController.fetchUsers);
router.post("/invite", Authorize.verifyToken, userController.inviteUsers);
router.delete("/:id", Authorize.verifyToken, userController.deleteUser);
router.post("/delete_users", Authorize.verifyToken, userController.deleteAllUsers);

module.exports = router;
 
