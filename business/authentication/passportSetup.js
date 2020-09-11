const passport = require('passport'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	User = require('../../models/User');

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((incomingUser, done) => {
		done(null, incomingUser);
	});

	passport.deserializeUser((userFromCookie, done) => {
		done(null, userFromCookie);
	});

	require('./authGoogle')(passport);
	require('./authJWT')(passport);
};