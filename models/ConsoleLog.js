const mongoose = require('mongoose');

const ConsoleLogSchema = new mongoose.Schema({
	message: String,
	level: String,
	timestamp: String
});

ConsoleLogSchema.index({ expireAt: 1 }, { expireAfterSeconds : 60 * 60 * 24 * 30 });

module.exports = mongoose.model("ConsoleLog", ConsoleLogSchema);