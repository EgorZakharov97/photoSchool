const mongoose = require('mongoose');

PresetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	file: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Preset", PresetSchema);