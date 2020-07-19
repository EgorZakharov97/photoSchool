const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../tools/logger'),
	crypto = require('crypto'),
	mailTransporter = require('../tools/mailTransporter')(),
	encrypt = require('../tools/encrypter').encrypt,
	decrypt = require('../tools/encrypter').decrypt;
let router = express.Router();

let authOptions = {
	successRedirect: '/',
	failureRedirect: '/auth',
	session: true
};

router.get('/auth', (req, res) => {
	res.send('Failure redirect for authentication');
});

router.get('/auth/google',
	passport.authenticate('google'),
	(req, res) => {

});

router.get('/auth/google/callback',
	passport.authenticate('google', authOptions),
	(req, res) => {

});

// Render the login page
router.get('/auth/local', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/temp', 'login.html'))
});

// perform authentication
router.post('/auth/local',
	passport.authenticate('local', authOptions),
	(req, res) => {

});

// show register page
router.get('/auth/local/register', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/temp', 'Register-local.html'));
});

// register a new user
router.post('/auth/local/register', (req, res) => {
	console.log(req.body);
	let profile = req.body;
	if(profile.password === profile.rePassword){
		User.create({
			email: profile.username,
			firstName: profile.firstName,
			lastName: profile.lastName,
			displayName: profile.displayName,
			dateBorn: profile.dateBorn,
			sex: profile.sex,
			locale: 'ru',
			verified: false,
			comingFrom: 'local',
			admin: false,
		}, (err, newUser) => {
			if(err){
				logger.error(err);
				res.send("User already exists");
			} else {
				newUser.setPassword(profile.password);
				newUser.save();
				logger.info(`New user created: ${newUser.displayName}, id: ${newUser._id}`);
				res.redirect('/');
			}
		})
	} else {
		res.send("Passwords does not match");
	}
});

router.get('/auth/local/reset', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/temp', 'reset.html'))
});

router.post('/auth/local/reset', (req, res) => {
	if(req.body.email){
		User.findOne(req.body, (err, user) => {
			if(err){
				res.send("User with this email does not exist")
			} else {
				if(user){
					let secret = user.email + '|' + new Date().toString();
					user.password.reset.hash = encrypt(secret);

					let emailOptions = {
						from: process.env.EMAIL,
						to: user.email,
						subject: 'TuttiFashion password reset',
						html: `<p>Here is a link to reset your password. Do not share this link to anyone.</p><p>${process.env.ADDRESS + '/auth/local/reset/' + user.password.reset.hash}</p>`
					};

					mailTransporter.sendMail(emailOptions, (err, info) => {
						if(err){
							logger.error(err)
						} else {
							logger.info(`Password reset email was sent to ${user.email}`);
						}
					});

					res.send("Email confirmation has been sent to your email")
				} else {
					res.redirect('/auth/local/reset')
				}
			}
		});
	} else {
		res.redirect('/auth/local/reset')
	}

});

router.get('/auth/local/reset/:code', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/temp', 'new-password.html'));
});

router.post('/auth/local/reset/:code', (req, res) => {
	try {
		let data = decrypt(req.params.code).split('|');
		let email = data[0];
		let now = new Date();
		let date = new Date(data[1]);

		let password = req.body.password;
		let rePassword = req.body.rePassword;

		if(password === rePassword){
			if ((now - date) / 60000 <= 5) {
				User.findOne({email: email}, (err, user) => {
					if(err) {
						logger.error(err);
						res.json({msg: 'Internal server error'}).status(500);
					} else {
						user.setPassword(password);
						user.origin = 'local';
						user.save();
						logger.info(`User ${user.displayName} (${user._id}) has successfully changed his password`);
						res.json({msg: 'Password successfully restored'})
					}
				})
			} else {
				logger.info(`User ${user.displayName} (${user._id}) is trying to change password: link expired`);
				res.json({msg: 'This link has expired'}).status(401);
			}
		} else {
			res.json({msg: 'Passwords does not match'}).status(500);
		}
	} catch (e) {
		logger.warn(`!!!someone is trying to reset a password with an invalid Link!!!`);
		res.json({msg: 'This reset URL does not seem good. Please try requesting a new password again'}).status(401);
	}
});

// logout a user
router.get('/auth/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;