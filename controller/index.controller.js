const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	User = require('../models/User');

module.exports.getIndexPage = async (req, res, next) => {
	let courses;
	let discount;
	if(req.user) {
		if(req.user.admin){
			courses = await Course.find({}).sort('importantDates.courseStarts');
		} else {
			let user = await User.findById(req.user._id);
			discount = Math.round((1 - user.getPriceMultiplier()) * 100);
			courses = await Course.find({$and: [{"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}, {_id: {$nin: req.user.courses}}]}).sort('importantDates.courseStarts');
		}
	} else {
		courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts')
	}

	res.render('index', {
		courses: courses,
		user: req.user || 'NONE',
		discount: discount || 'NONE'
	});
};

module.exports.getCourses = (req, res, next) => {
	Course.find({$and: [{"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}, {_id: {$nin: req.user.courses}}]}).sort('importantDates.courseStarts').exec((err, courses) => {
		if(err){
			logger.error(err)
		} else {
			res.json(courses)
		}
	});
}