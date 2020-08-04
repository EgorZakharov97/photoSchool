const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course');

module.exports.getIndexPage = async (req, res, next) => {
	let courses;
	if(req.user) {
		if(req.user.admin){
			courses = await Course.find({}).sort('importantDates.courseStarts');
		} else {
			courses = await Course.find({$and: [{"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}, {_id: {$nin: req.user.courses}}]}).sort('importantDates.courseStarts');
		}
	} else {
		courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts')
	}

	logger.warn(`This is a test message`);

	res.render('index', {
		courses: courses,
		user: req.user || 'NONE'
	});
};