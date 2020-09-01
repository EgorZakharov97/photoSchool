const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	crypto = require('crypto'),
	encrypt = require('../service/business/encrypter').encrypt,
	decrypt = require('../service/business/encrypter').decrypt,
	controller = require('../controller/portal.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated;
let router = express.Router();

router.route('/')
	.get(isAuthenticated, controller.getPortal);

router.route('/workshops')
	.get(isAuthenticated, controller.getWorkshops);

router.route('/tutorials')
	.get();

router.route('/courses')
	.get(isAuthenticated, controller.getCourses);

router.route('/materials')
	.get();

router.route('/presets')
	.get();

router.route('/videos')
	.get(isAuthenticated, controller.getVideos);

module.exports = router;