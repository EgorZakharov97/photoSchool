const logger = require('../logger/logger');

module.exports.responseHandler = function(req, res, next) {
	res.json({
		success: true,
		body: res.data,
		message: res.msg || ""
	})
};

module.exports.errorHandler = function(err, req, res, next) {
	logger.error(err.stack);
	if (!err.statusCode) err.statusCode = 200;
	res.status(err.statusCode);
	res.json({
		success: false,
		body: err.data || res.data,
		message: err.message || err.errmsg || '500 Internal Server Error'
	})
};