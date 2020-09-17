const express = require('express'),
	controller = require('../controller/auth.controller'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../business/logger/logger'),
	crypto = require('crypto'),
	encrypt = require('../business/service/encrypter').encrypt,
	decrypt = require('../business/service/encrypter').decrypt,
	errors = require('../business/errors/Errors'),
	sendMail = require('../business/email/mailTransporter');

let router = express.Router();

// perform authentication
router.route('/login')
	.post(controller.login);

router.route('/register')
	.post(controller.register);

router.route('/reset')
	.post(controller.sendResetMessage);

router.route('/reset/new')
	.post(controller.resetPassword);

router.route('/confirm/:code')
	.get(controller.confirmUser);

router.route('/google')
	.post(controller.authenticateGoogle);

router.route('/update')
	.post(
		passport.authenticate('jwt', {session: false}),
		controller.updateUserInfo
	);

router.route('/update/payment-method')
	.post(
		passport.authenticate('jwt', {session: false}),
		controller.updatePaymentMethod
	);

router.route('/google/callback')
	.post(
		(req, res, next) => {console.log(req.body)}
	);

module.exports = router;