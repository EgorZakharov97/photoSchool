const GoogleStrategy = require('passport-google-oauth20').Strategy,
	User = require('../../models/User'),
	logger = require('../logger/logger');

module.exports = (passport) => {

	passport.use(new GoogleStrategy({
			clientID: process.env.AUTH_GOOGLE_CLIENT,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			callbackURL: process.env.AUTH_GOOGLE_REDIRECT,
			scope: ['profile', 'email'],
			session: true
		},
		function(token, tokenSecret, profile, done) {
			profile = profile._json;

			User.findOne({email: profile.email}, (err, userDB) => {
				if(err){
					logger.error(err);
					return done(err, null);
				} else if (userDB) {
					logger.info(`User ${userDB.username} (${userDB._id}) just logged in`);
					return done(null, userDB)
				} else {
					User.create({
						email: profile.email,
						username: profile.name,
						origin: 'google',
						picture: profile.picture,
						verification: {verified: true},
						admin: false,
						complete: false,
						courses: [],
					}, (err2, newUser) => {
						if(err2) {
							logger.error(err2);
							return done(err2, null);
						} else {
							logger.info(`New user created: ${newUser.username}, id: ${newUser._id}`);
							return done(null, newUser)
						}
					})
				}
			});
		}
	));
};