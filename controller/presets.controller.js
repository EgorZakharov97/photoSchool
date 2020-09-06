const logger = require('../business/logger/logger'),
	Preset = require('../models/Preset'),
	errors = require('../business/errors/Errors');

module.exports.getPresetNames = (req, res, next) => {
	Preset.find({}, 'name', (err, preset) => {
		if(err) next(err);
		res.data = preset;
		next();
	});
};

module.exports.getPreset = (req, res, next) => {
	Preset.findOne({name: req.params.name}, (err, preset) => {
		if(err) next(err);
		if(preset){
			res.data = preset;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};