const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	crypto = require('crypto'),
	encrypt = require('../service/tools/encrypter').encrypt,
	decrypt = require('../service/tools/encrypter').decrypt,
	controller = require('../controller/auth.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	doesExist = require('../service/middleware/authCheck').doesExist;
let router = express.Router();

let authOptions = {
	successRedirect: '/portal',
	failureRedirect: '/auth',
	session: true
};

router.route('/')
	.get(controller.getLoginPage);

router.route('/google')
	.get(passport.authenticate('google'));

router.route('/google/callback')
	.get(passport.authenticate('google', authOptions));

// perform authentication
router.route('/local')
	.post(passport.authenticate('local', authOptions));

// Show update user page
router.route('/update')
	.get(doesExist, controller.getUpdateUserInfoPage)
	.post(doesExist, controller.updateUserInfo);

// show register page
router.route('/local/register')
	.get(controller.getRegisterPage);

// register a new user
router.route('/local/register')
	.post(controller.registerNewUser);

// send to confirmation page
router.route('/local/confirm/:code')
	.get(controller.confirmUser);

router.route('/local/confirm')
	.get(controller.getConfirmationPage);

router.route('/local/reset')
	.get(controller.getForgotPwrdPage)
	.post(controller.sendPwrdMsg);

router.route('/local/reset/:code')
	.get(controller.getNewPwrdPage)
	.post(controller.doPwdReset);

router.route('/local/fastRegister')
	.post(controller.fastRegistrationCheck);

// logout a user
router.route('/logout')
	.get(controller.logout);

module.exports = router;