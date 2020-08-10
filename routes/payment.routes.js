const express = require('express'),
		isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
		doesExist = require('../service/middleware/authCheck').doesExist,
		isAdmin = require('../service/middleware/authCheck').isAdmin,
		User = require('../models/User'),
		logger = require('../service/logger/logger'),
		controller = require('../controller/payment.controller');
let router = express.Router();

router.route('/course/:id')
	.get(doesExist, controller.preparePayment);

router.route('/webhook')
	.post(controller.success);

router.route('/checkCoupon')
	.post(controller.checkCoupon);

module.exports = router;