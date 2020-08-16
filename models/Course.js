const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
		discountDeadline: {
			type: Date,
			required: true
		},
		registrationDeadline: {
			type: Date,
			required: true
		}
	},
	pricing: {
		discountPrice: {
			type: Number,
			required: true
		},
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
	comments: [
		{
			type: mongoose.Schema.Types.ObjectID,
            ref: "Comment",
		}
	]
});

CourseSchema.methods.calculateCurrentPrice = function() {
	let today = new Date();
	let price;
	today > new Date(this.importantDates.discountDeadline)+1 ? price = this.pricing.finalPrice : price = this.pricing.discountPrice;
	return price;
};

module.exports = mongoose.model("Course", CourseSchema);