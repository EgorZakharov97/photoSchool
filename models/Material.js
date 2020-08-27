const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	file: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Material", MaterialSchema);