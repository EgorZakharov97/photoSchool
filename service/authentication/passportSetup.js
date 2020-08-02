const passport = require('passport');

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
	require('./authLocal')(passport);
};