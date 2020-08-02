const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course');

module.exports.getIndexPage = (req, res, next) => {
	Course.find({"importantDates.courseStarts": {$gt: new Date()}}, (err, courses) => {
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