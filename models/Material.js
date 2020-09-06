const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	file: {
		type: String,
	},
	image: {
		type: String,
	},
	accessBySubscription: {
		type: Boolean,
		required: true
	}
});

module.exports = mongoose.model("Material", MaterialSchema);