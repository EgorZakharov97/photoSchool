const GoogleStrategy = require('passport-google-oauth20').Strategy,
	User = require('../models/User'),
	logger = require('../tools/logger');

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
					logger.info(`User ${userDB.displayName} (${userDB._id}) just logged in`);
					return done(null, userDB)
				} else {
					User.create({
						email: profile.email,
						firstName: profile.given_name,
						lastName: profile.family_name,
						displayName: profile.name,
						comingFrom: 'google',
						picture: profile.picture,
						locale: profile.locale,
						verified: true,
					}, (err2, newUser) => {
						if(err2) {
							logger.error(err2);
							return done(err2, null);
						} else {
							logger.info(`New user created: ${newUser.displayName}, id: ${newUser._id}`);
							return done(null, newUser)
						}
					})
				}
			});
		}
	));
};