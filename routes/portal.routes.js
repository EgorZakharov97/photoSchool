const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	crypto = require('crypto'),
	encrypt = require('../service/tools/encrypter').encrypt,
	decrypt = require('../service/tools/encrypter').decrypt,
	controller = require('../controller/portal.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated;
let router = express.Router();

router.route('/').get(isAuthenticated, controller.getPortal);

module.exports = router;