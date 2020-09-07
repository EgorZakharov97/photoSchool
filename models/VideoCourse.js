const mongoose = require('mongoose');

const VideoCourseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true,
	},
	course: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Course",
		required: true
	}
});

module.exports = mongoose.model("VideoCourse", VideoCourseSchema);