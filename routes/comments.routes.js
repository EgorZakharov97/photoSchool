const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	crypto = require('crypto'),
	encrypt = require('../service/tools/encrypter').encrypt,
	decrypt = require('../service/tools/encrypter').decrypt,
	controller = require('../controller/comment.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated;
let router = express.Router();

router.route('/comment/:comment')
	.put(isAuthenticated, controller.updateComment)
	.delete(isAuthenticated, controller.deleteComment)
	.post(isAuthenticated, controller.postSubcomment)

router.route('/course/:id/comment')
    .post(isAuthenticated, controller.postComment);

module.exports = router;