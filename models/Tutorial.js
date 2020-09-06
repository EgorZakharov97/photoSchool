const mongoose = require('mongoose');

TutorialSchema = new mongoose.Schema({
	link: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "CategoryTutorial",
		required: true
	},
	image: {
		type: String,
		required: false
	},
	accessBySubscription: Boolean,
});

module.exports = mongoose.model("Tutorial", TutorialSchema);