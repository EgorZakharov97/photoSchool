const mongoose = require('mongoose');

const ExampleCourseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: false,
	},
	course: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Course",
		required: true
	}
});

module.exports = mongoose.model("ExampleCourse", ExampleCourseSchema);