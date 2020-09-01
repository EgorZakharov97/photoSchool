const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User",
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ["Standard", "Free"],
		default: "Standard"
	},
	dateIssued: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateEnds: {
		type: Date,
		required: true,
	},
	payment: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Payment"
	}
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);