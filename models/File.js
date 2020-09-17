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
	parent: {
		type: mongoose.Schema.Types.ObjectID,
		required: true
	}
});

module.exports = mongoose.model("FileCourse", FileCourseSchema);