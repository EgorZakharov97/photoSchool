const logger = require('../business/logger/logger'),
	Tutorial = require('../models/Tutorial'),
	CategoryTutorial = require('../models/CategoryTutorial'),
	errors = require('../business/errors/Errors');

module.exports.getTutorialNames = (req, res, next) => {
	Tutorial.find({}, 'name', (err, workshops) => {
		if(err) next(err);
		res.data = workshops;
		next();
	});
};

module.exports.getTutorial = (req, res, next) => {
	Tutorial.findOne({name: req.params.name}).populate('category').exec((err, tutorial) => {
		if(err) next(err);
		if(tutorial){
			res.data = tutorial;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getCategoryNames = (req, res, next) => {
	CategoryTutorial.find({}, 'name', (err, categories) => {
		if(err) next(err);
		res.data = categories;
		next();
	});
};