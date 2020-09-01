const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	importantDates: {
		courseStarts: {
			type: Date,
			required: true
		},
		courseEnds: {
			type: Date,
			required: true
		},
		registrationDeadline: {
			type: Date,
			required: true
		}
	},
	pricing: {
		finalPrice: {
			type: Number,
			required: true
		}
	},
	seats: {
		total: {
			type: Number,
			required: true
		},
		occupied: {
			type: Number,
			default: 0
		}
	},
	image: {
		type: String,
		required: false
	},
	richText: {
		description: {
			type: String,
			required: true
		},
		timeline: {
			type: String,
			required: true
		},
		willLearn: {
			type: String,
			required: true
		}
	},
	chatLink: {
		type: String,
		required: false
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "User"
		}
	]
});

module.exports = mongoose.model("Workshop", WorkshopSchema);