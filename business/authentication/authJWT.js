const User = require('../../models/User'),
	logger = require('../logger/logger'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.AUTH_LOCAL_USER_SECRET;

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		User.findById(jwt_payload.id, function(err, user) {

			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
				// or you could create a new account
			}
		});
	}));
};