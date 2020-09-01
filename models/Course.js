const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	public: {
		type: Boolean,
		required: true,
		default: false,
	},
	pricing: {
		finalPrice: {
			type: Number,
			required: true
		}
	},
	image: {
		type: String,
		required: false
	},
	videos: [
		{
			type: String,
		}
	],
	files: [
		{
			type: String,
		}
	],
	examples: [
		{
			type: String,
		}
	]
});

module.exports = mongoose.model("Course", CourseSchema);