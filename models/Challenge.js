const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
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
	description: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Challenge", ChallengeSchema);