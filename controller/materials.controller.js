const logger = require('../business/logger/logger'),
	Material = require('../models/Material'),
	errors = require('../business/errors/Errors');

module.exports.getMaterialNames = (req, res, next) => {
	Material.find({}, 'name', (err, materials) => {
		if(err) next(err);
		res.data = materials;
		next();
	});
};

module.exports.getMaterial = (req, res, next) => {
	Material.findOne({name: req.params.name}, (err, material) => {
		if(err) next(err);
		if(material){
			res.data = material;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};