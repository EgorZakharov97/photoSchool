const express = require('express'),
	errors = require('../business/errors/Errors'),
	logger = require('../business/logger/logger'),
	controller = require('../controller/payment.controller'),
	bodyParser = require('body-parser');

let router = express.Router();

router.route('/subscribe')
	.post(controller.subscribe);

router.route('/webhook')
	.post(
		bodyParser.raw({type: 'application/json'}),
		controller.webhook
	);

router.route('/subscribe')
	.post(controller.subscribe)

module.exports = router;