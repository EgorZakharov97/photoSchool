const express = require('express'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	logger = require('../service/logger/logger'),
	Course = require('../models/Course');
let router = express.Router();

module.exports.getIndexPage = (req, res, next) => {
	Course.find({}, (err, courses) => {
		if(err){
			logger.error(err);
			res.render('500').status(500);
		} else {
			res.render('index', {
				courses: courses,
				user: req.user || {}
			});
		}
	})
};