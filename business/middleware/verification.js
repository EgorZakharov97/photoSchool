const errors = require('../errors/Errors'),
	Workshop = require('../../models/Workshop'),
	Tutorial = require('../../models/Tutorial'),
	Preset = require('../../models/Preset'),
	Material = require('../../models/Material'),
	Coupon = require('../../models/Coupon'),
	Challenge = require('../../models/Challenge'),
	CategoryTutorial = require('../../models/CategoryTutorial'),
	Course = require('../../models/Course'),
	ExampleCourse = require('../../models/ExampleCourse'),
	FileCourse = require('../../models/FileCourse'),
	VideoCourse = require('../../models/VideoCourse');

module.exports.verifyWorkshop = async (req, res, next) => {
	const data = req.body;
	if(
		!(data.name &&
			data.starts &&
			data.ends &&
			data.deadline &&
			data.duration &&
			data.price &&
			(data.numPlaces || data.seats) &&
			data.description &&
			data.timeline &&
			data.willLearn)
	) return next(new errors.IncompleteReqDataError(data));

	req.DataClass = Workshop;
	req.body  = {
			name: data.name,
			importantDates: {
				courseStarts: data.starts,
				courseEnds: data.ends,
				registrationDeadline: data.deadline
			},
			pricing: {
				finalPrice: data.price
			},
			seats: {
				total: data.seats,
			},
			duration: data.duration,
			richText: {
				description: data.description,
				timeline: data.timeline,
				willLearn: data.willLearn
			}
		};

	if(data.chatLink) req.body.chatLink = data.chatLink;
	if(data._id) req.body._id = data._id;

	next()
};

module.exports.verifyTutorial = async (req, res, next) => {
	let data = req.body;
	if(!(
		data.name &&
		data.description &&
		data.category &&
		data.link
	)) return next(new errors.IncompleteReqDataError(data));
	let category = await CategoryTutorial.findOne({name: data.category});
	if(!category) category = await CategoryTutorial.create({name: data.category});
	req.body.category = category._id;
	req.DataClass = Tutorial;
	req.category = category;
	next()
};

module.exports.verifyPreset = async (req, res, next) => {
	let data = req.body;
	if (!(
		data.name && data.subscription
	)) return next(new errors.IncompleteReqDataError(data));
	req.body.accessBySubscription = data.subscription;
	req.DataClass = Preset;
	next()
};

module.exports.verifyMaterial = (req, res, next) => {
	let data = req.body;
	if (!(
		data.name && data.subscription
	)) return next(new errors.IncompleteReqDataError(data));

	req.body.accessBySubscription = data.subscription;
	req.DataClass = Material;
	next()
};

module.exports.verifyCoupon = (req, res, next) => {
	let data = req.body;

	if(!(
		data.name &&
		data.code &&
		data.discount &&
		data.product &&
		data.usage
	)) return next(new errors.IncompleteReqDataError(data));

	if (data.expires) req.body.expiryDate = new Date(data.expires);
	req.body.singleUse = data.usage === 'onetime';
	req.body.wasUsed = 0;
	req.DataClass = Coupon;
	next()
};

module.exports.verifyChallenge = (req, res, next) => {
	let data = req.body;

	if(!(
		data.name &&
		data.description
	)) return next(new errors.IncompleteReqDataError(data));

	req.DataClass = Challenge;
	next()
};

module.exports.verifyCourse = (req, res, next) => {
	let data = req.body;

	if(!(
		data.name &&
		data.price &&
		data.description
	)) return next(new errors.IncompleteReqDataError(data));
	req.body.pricing = {finalPrice: data.price};
	req.DataClass = Course;
	next()
};

module.exports.verifyVideoCourse = (req, res, next) => {
	let data = req.body;

	if(!(
		data.name &&
		(data.link) &&
		data.course
	)) return next(new errors.IncompleteReqDataError(data));
	req.DataClass = VideoCourse;
	next()
};

module.exports.verifyFileCourse = (req, res, next) => {
	let data = req.body;
	if(!(
		data.name && data.course
	)) return next(new errors.IncompleteReqDataError(data));

	req.DataClass = FileCourse;
	next()
};