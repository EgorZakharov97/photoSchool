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
	firstName: String,
	lastName: String,
	displayName: String,
	dateBorn: Date,
	picture: String,
	sex: String,
	password: {
		salt: String,
		hash: String,
		reset: {
			salt: String,
			hash: String,
		}
	},
	locale: {
		type: String,
		default: 'ru'
	},
	verified: Boolean,
	origin: {
		type: String,
		default: 'local'
	},
	admin: {
		type: Boolean,
		default: false
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

module.exports = mongoose.model("User", UserSchema);