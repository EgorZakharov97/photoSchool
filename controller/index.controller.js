const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	User = require('../models/User');

module.exports.getIndexPage = async (req, res, next) => {
	let courses;
	let discount;
	let pastCourses;
	if(req.user) {
		let user = await User.findById(req.user._id);
		discount = Math.round((1 - user.getPriceMultiplier()) * 100);
		courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts');
	} else {
		courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts')
	}

	pastCourses = await Course
		.find({"importantDates.courseEnds": {$lt: Date.now()}})
		.sort('importantDates.courseStarts')
		.populate('comments');

	res.render('index', {
		courses: courses,
		user: req.user || 'NONE',
		discount: discount || 'NONE',
		pastCourses: pastCourses || []
	});
};