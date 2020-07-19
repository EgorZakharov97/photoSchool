const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	crypto = require('crypto'),
	mailTransporter = require('../service/email/mailTransporter')(),
	encrypt = require('../service/tools/encrypter').encrypt,
	decrypt = require('../service/tools/encrypter').decrypt,
	controller = require('../controller/auth.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated;
let router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
	res.render('members-portal')
});

module.exports = router;