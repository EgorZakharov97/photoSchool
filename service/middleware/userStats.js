const RequestLog = require('../../models/RequestLog'),
	moment = require('moment');

module.exports = (req, res, next) => {
	let requestTime = new Date();
	res.on('finish', () => {
		if(req.path !== '/analytics') {
			RequestLog.create({
				url: req.path,
				method: req.method,
				responseTime: (Date.now() - requestTime) / 1000, //convert to seconds
				day: moment(requestTime).format('dddd'),
				hour: moment(requestTime).hour()
			});
		}
	});
	next();
};