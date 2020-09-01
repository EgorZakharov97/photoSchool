const User = require('../models/User'),
	Workshop = require('../models/Workshop'),
	Course = require('../models/Course'),
	errors = require('../service/errors/Errors'),
	{handleResponseError, handleResponse} = require('../service/business/responseHandler');

module.exports.createWorkshop = (req ,res ,next) => {
	const data = req.body;
	if(
		!(data.name &&
		data.starts &&
		data.ends &&
		data.deadline &&
		data.price &&
		data.seats &&
		data.description &&
		data.timeline &&
		data.willLearn)
	) {
		handleResponseError(new errors.IncompleteDataError("Data is incomplete"), res)
	} else {
		const workshopData = {
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
			richText: {
				description: data.description,
				timeline: data.timeline,
				willLearn: data.willLearn
			}
		};

		if(data.chatLink) workshopData.chatLink = data.chatLink;

		Workshop.create(workshopData, (err, workshop) => {
			if(err) {
				handleResponseError(err, res)
			} else {
				handleResponse(workshopData, res);
			}
		})
	}
};