const mongoose = require('mongoose');

VideoSchema = new mongoose.Schema({
	URL: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	accessBySubscription: Boolean,
	courses: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Course"
		}
	]
});

module.exports = mongoose.model("Video", VideoSchema);