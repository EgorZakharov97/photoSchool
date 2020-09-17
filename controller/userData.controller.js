const Workshop = require('../models/Workshop'),
	Material = require('../models/Material'),
	Preset = require('../models/Preset');

module.exports.getWorkshops = (req, res, next) => {
	req.DataClass = Workshop;
	req.query = req.user.workshops;
	next()
};

module.exports.getMaterials = (req, res, next) => {
	req.DataClass = Material;
	req.query = 'name image';
	next()
};

module.exports.getPresets = (req, res, next) => {
	req.DataClass = Preset;
	req.query = 'name image';
	next()
};

module.exports.downloadPreset = (req, res, next) => {
	console.log('oka')
	res.download('./portalFiles/presets/' + req.params.id)
};