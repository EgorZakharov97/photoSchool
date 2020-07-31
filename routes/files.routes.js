const express = require('express'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	controller = require('../controller/admin.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	upload = require('../service/middleware/multer');
let router = express.Router();

module.exports = router;