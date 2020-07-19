const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
	url: String,
	method: String,
	responseTime: Number,
	day: String,
	hour: Number,
	expireAt: {
		type: Date,
		default: Date.now(),
		required: true
	}
});

RequestLogSchema.index({ expireAt: 1 }, { expireAfterSeconds : 60 * 60 * 24 * 30 });

module.exports = mongoose.model("RequestLog", RequestLogSchema);