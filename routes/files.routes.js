const express = require('express'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	controller = require('../controller/admin.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	upload = require('../service/middleware/multer');
let router = express.Router();

router.post('/get', isAuthenticated, (req, res) => {
	try {
		res.download(req.body.file);
	}
	catch(e){
		logger.error(`User ${req.user.username} failed to download file ${req.body.file}`)
		res.render('500').status(500)
	}
});

module.exports = router;