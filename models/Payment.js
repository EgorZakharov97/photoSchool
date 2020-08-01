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
	session: Object
});

module.exports = mongoose.model("Payment", PaymentSchema);