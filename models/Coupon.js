const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	discount: {
		type: Number,
		required: true
	},
	expiryDate: Date,
	singleUse: {
		type: Boolean,
		default: false
	},
	wasUsed: {
		type: Number,
		default: 0,
		required: true,
	},
	product: {
		type: String,
		enum: ["workshop", "course"],
		required: true
	}
});

module.exports = mongoose.model("Coupon", CouponSchema);