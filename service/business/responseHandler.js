const logger = require('../logger/logger');

module.exports.handleResponseError = (err, res) => {
	logger.error(err);
	res.json({success: false, error: err.message})
};

module.exports.handleResponse = (data, res) => {
	res.json({success: true, data: data})
};