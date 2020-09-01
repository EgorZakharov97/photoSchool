const express = require('express'),
	controller = require('../controller/admin.controller');

let router = express.Router();

router.route('/workshop')
	.get()
	.post(controller.createWorkshop);

module.exports = router;