const express = require('express'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course');

module.exports.getIndexPage = async (req, res, next) => {
	let courses;
	if(req.user){
		courses = await Course.find({$and: [{"importantDates.courseStarts": {$gt: new Date()}}, {_id: {$nin: req.user.courses}}]});
	} else {
		courses = await Course.find({"importantDates.courseStarts": {$gt: new Date()}})
	}
	res.render('index', {
		courses: courses,
		user: req.user || 'NONE'
	});
};