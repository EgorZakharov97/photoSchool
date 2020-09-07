const mongoose = require('mongoose');

const FileCourseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	file: {
		type: String,
		required: false,
	},
	course: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Course",
		required: true
	}
});

module.exports = mongoose.model("FileCourse", FileCourseSchema);