const mongoose = require('mongoose');

PaymentSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "User"
	},
	course: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Course"
	},
	timeCreated: {
		type: Date,
		required: true
	},
	timeReceived: Date,
	received: Boolean,
	session: Object,
	intent: {
		type: String,
		required: true
	},
	coupon: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "Coupon"
	}
});

module.exports = mongoose.model("Payment", PaymentSchema);