const User = require('../../models/User'),
	logger = require('../logger/logger'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
	passport.use(new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			session: true,
		},
		(username, password, done) => {
			User.findOne({email: username}, (err, user) => {
				if(err){
					logger.error(err);
					return done(err)
				} else if(!user) {
					logger.info(`User ${username} is not registered`);
					return done(null, false, {msg: "You are not registered"})
				} else if(user.origin !== 'local') {
					logger.info(`User ${username} is not local but truing to authenticate locally`);
					return done(null, false, {msg: `Please, use ${user.origin} to authenticate or use 'Reset Password'`})
				} else if(!user.validatePassword(password)){
					logger.info(`${user.username} has entered the wrong password`);
					return done(null, false, {msg: "Wrong password"})
				} else {
					logger.info(`${user.username} (${user._id}) logged in`);
					return done(null, user);
				}
			})
		}
	))
};