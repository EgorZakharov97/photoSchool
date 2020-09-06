const logger = require('../business/logger/logger'),
	Challenge = require('../models/Challenge');

module.exports.getChallengeNames = (req, res, next) => {
	Challenge.find({}, 'name', (err, preset) => {
		if(err) next(err);
		res.data = preset;
		next();
	});
};