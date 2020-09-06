const mongoose = require('mongoose');

PresetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
	},
	file: {
		type: String,
	},
	accessBySubscription: {
		type: Boolean,
		required: true
	}
});

module.exports = mongoose.model("Preset", PresetSchema);