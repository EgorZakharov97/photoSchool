const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	User = require('../models/User'),
	Review = require('../models/Review'),
	Subscriber = require('../models/Subscriber');

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

module.exports.getReviewPage = (req, res, next) => {
	let email = req.params.email;
	if(email){
		res.render('review-form', {email: email, HOST: process.env.HOST});
	} else {
		res.status(500);
		res.render('500');
	}
}

module.exports.postReview = (req, res, next) => {
	let email = req.params.email;
	if(email) {
		Review.create(req.body, (err, review) => {
			if(err){
				logger.error(err);
				res.status(500);
				res.redirect('/');
			} else {
				logger.info(`${email} just left a review with id ${review.id}`);
				logger.info(`Portal: ${review.portal}\nWorkshop: ${review.workshop}\nWebEx: ${review.webex}\nBody:\n${review.body}\n`);
				res.redirect('/');
			}
		})
	}
}

module.exports.leaveEmail = async (req, res, next) => {
	if(req.body.email){
		let email = req.body.email;
		let valid;
		let subscriberWithThisEmail = await Subscriber.findOne({email: email});
		email.includes('@') && email.includes('.') && !subscriberWithThisEmail ? valid = true : valid = false;

		if (valid) Subscriber.create({email: email}, (err, subs) => {
			err ? logger.error(err) : logger.info(`Someone subscribed (${email})`);
		}) 
	}

	res.redirect('back');
}