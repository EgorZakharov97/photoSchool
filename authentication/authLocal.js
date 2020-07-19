const User = require('../models/User'),
	logger = require('../tools/logger'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
	passport.use(new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
			session: true,
		},
		(username, password, done) => {
			User.findOne({email: username}, (err, user) => {
				if(err){
					logger.error(err);
					return done(err)
				} else if(!user) {
					return done(null, false, {msg: "You are not registered"})
				} else if(user.origin !== 'local') {
					return done(null, false, {msg: `Please, use ${user.origin} to authenticate`})
				} else if(!user.validatePassword(password)){
					return done(null, false, {msg: "Wrong password"})
				} else {
					logger.info(`User logged in: ${user.displayName}, id: ${user._id}`);
					return done(null, user);
				}
			})
		}
	))
};