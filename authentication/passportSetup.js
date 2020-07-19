const passport = require('passport');

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	// app.use((req, res, next) => {
	// 	console.log(req.session);
	// 	console.log(req.user);
	// 	next();
	// });

	passport.serializeUser((incomingUser, done) => {
		done(null, incomingUser);
	});

	passport.deserializeUser((userFromCookie, done) => {
		done(null, userFromCookie);
	});

	require('./authGoogle')(passport);
	require('./authLocal')(passport);
};