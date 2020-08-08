const mongoose = require('mongoose'),
	crypto = require('crypto'),
	jwt = require('express-jwt');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	username: String,
	picture: String,
	sex: String,
	phoneNumber: Number,
	experience: String,
	password: {
		salt: String,
		hash: String,
		reset: {
			salt: String,
			hash: String,
		}
	},
	verification: {
		verified: {
			type: Boolean,
			default: false
		},
		verificationLink: String
	},
	origin: {
		type: String,
		default: 'local'
	},
	complete: {
		type: Boolean,
		default: false
	},
	admin: {
		type: Boolean,
		default: false
	},
	subscriptionEnds: Date,
	courses: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Course"
		}
	],
	discount: {
		discountCount: Number
	}
});

UserSchema.methods.setPassword = function(password) {
	this.password.salt = crypto.randomBytes(16).toString('hex');
	this.password.hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
	const hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
	return this.password.hash === hash;
};

UserSchema.methods.generateJWT = function() {
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 120);

	return jwt.sign({
		email: this.email,
		id: this._id,
		exp: parseInt(expirationDate.getTime() / 1000, 10),
	}, process.env.AUTH_LOCAL_USER_SECRET);
};

UserSchema.methods.toAuthJSON = function() {
	return {
		_id: this._id,
		email: this.email,
		token: this.generateJWT(),
	};
};

// This one calculates the price multiplier for a workshop (discount for points saving)
UserSchema.methods.getPriceMultiplier = function () {
	let multiplier;
	switch (this.discount.discountCount) {
		case 1:
			multiplier = 0.9;
			break;
		case 2:
			multiplier = 0.85;
			break;
		case 3:
			multiplier = 0.80;
			break;
		case 4:
			multiplier = 0.75;
			break;
		case 5:
			multiplier = 0;
			break;
		default:
			multiplier = 1;
			break;
	}
	return multiplier;
};

module.exports = mongoose.model("User", UserSchema);