const express = require('express'),
		isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
		isAdmin = require('../service/middleware/authCheck').isAdmin,
		User = require('../models/User'),
		logger = require('../service/logger/logger'),
		mailTransporter = require('../service/email/mailTransporter')(),
		controller = require('../controller/payment.controller');
let router = express.Router();

router.route('/course/:id')
	.get(isAuthenticated, controller.preparePayment);

router.route('/course/success')
	.post(controller.success);

module.exports = router;