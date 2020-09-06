const logger = require('../business/logger/logger'),
	Workshop = require('../models/Workshop'),
	errors = require('../business/errors/Errors');

module.exports.getWorkshops = (req, res, next) => {
	// let courses;
	// let discount;
	// let pastCourses;
	// if(req.user) {
	// 	let user = await User.findById(req.user._id);
	// 	discount = Math.round((1 - user.getPriceMultiplier()) * 100);
	// 	courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts');
	// } else {
	// 	courses = await Course.find({"importantDates.registrationDeadline": {$gt: Date.now() - 172800000}}).sort('importantDates.courseStarts')
	// }
	//
	// pastCourses = await Course
	// 	.find({"importantDates.courseEnds": {$lt: Date.now()}})
	// 	.sort('importantDates.courseStarts')
	// 	.populate('comments');

	Workshop.find({}, (err, workshops) => {
		if(err) next(err);
		res.data = workshops;
		next();
	});
};

module.exports.getWorkshopNames = (req, res, next) => {
	Workshop.find({}, 'name importantDates.courseStarts', (err, workshops) => {
		if(err) next(err);
		res.data = workshops;
		next();
	});
};

module.exports.getWorkshop = (req, res, next) => {
	Workshop.findOne({name: req.params.name}, (err, workshop) => {
		if(err) next(err);
		if(workshop){
			res.data = workshop;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getPastWorkshops = (req, res, next) => {

	Workshop.find({}, (err, workshops) => {
		if(err) next(err);
		res.data = workshops;
		next();
	});
};