const User = 			require('../models/User'),
	logger = 		require('../service/logger/logger'),
	sendMail = 		require('../service/email/mailTransporter'),
	encrypt = 		require('../service/tools/encrypter').encrypt,
	decrypt = 		require('../service/tools/encrypter').decrypt,
	passport = 		require('passport');

let authOptions = {
	successRedirect: '/portal',
	failureRedirect: '/auth',
	session: true
};

module.exports.fastRegistrationCheck = (req, res, next) => {
	let authOptions = {
		successRedirect: '/buy/course/' + req.body.courseID,
		failureRedirect: '/',
		session: true
	};

	User.findOne({email: req.body.email}, async (err, user) => {
		if(err) {
			logger.error(err);
			res.render('500').status(500);
		} else if(user){
			passport.authenticate('local', authOptions)(req, res, next);
		} else {
			let newUser = await User.create({
				email: req.body.email,
				verification: {
					verified: true
				},
				complete: false,
				comingFrom: 'local',
				admin: false,
				courses: []
			});
			await newUser.setPassword(req.body.password);
			await newUser.save();
			await logger.info(`${newUser.email} was fast created`);
			passport.authenticate('local', authOptions)(req, res, next);
		}
	})
};

// Getters
module.exports.getLoginPage = (req, res, next) => {
	res.render('login');
};

module.exports.getRegisterPage = (req, res, next) => {
	res.render('register')
};

module.exports.getForgotPwrdPage = (req, res, next) => {
	res.render('renew-password')
};

module.exports.getNewPwrdPage = (req, res, next) => {
	res.render('new-password')
};

module.exports.getConfirmationPage = (req, res, next) => {
	res.render('new-user-confirmation')
};

module.exports.getUpdateUserInfoPage = (req, res, next) => {
	User.findOne({email: req.user.email}, (err, user) => {
		if(err){
			logger.error(err);
		} else if(user) {
			res.render('update-user-info', {user: user})
		} else {
			res.redirect('/')
		}
	});
};

// Register a new User
module.exports.registerNewUser = (req, res, next) => {
	let profile = req.body;
	if(profile.password === profile.password_2){
		User.create({
			email: profile.email,
			username: profile.username,
			sex: profile.sex,
			verification: {
				verified: false,
				verificationLink: process.env.HOST + '/auth/local/confirm/' + encrypt(profile.email)
			},
			complete: true,
			experience: profile.experience,
			phoneNumber: profile.phoneNumber,
			comingFrom: 'local',
			admin: false,
			courses: []
		}, (err, newUser) => {
			if(err){
				logger.error(err);
				res.send("User already exists");
			} else {
				newUser.setPassword(profile.password);
				newUser.save();
				logger.info(`New user created: ${newUser.username}, id: ${newUser._id}`);

				// Sending verification email
				let emailOptions = {
					to: newUser.email,
					subject: 'Photolite password reset',
					html: `<h1>Hello from Photolite Academy!</h1><p>Here is the <a href=\"${newUser.verification.verificationLink}\">link</a> to verify your email</p><p>${newUser.verification.verificationLink}</p>`
				};
				sendMail(emailOptions, (err, info) => {
					if(err){
						logger.error(err)
					} else {
						logger.info(`New user confirmation was sent to ${newUser.email}`);
					}
				});
				res.redirect('/auth/local/confirm');
			}
		})
	} else {
		res.send("Passwords does not match");
	}
};

// update user info
module.exports.updateUserInfo = (req, res, next) => {
	let profile = req.body;
	if(profile.email){
		User.findOne({email: profile.email}, (err, user) => {
			user.username = profile.username;
			user.phoneNumber = profile.phoneNumber;
			user.experience = profile.experience;
			user.sex = profile.sex;
			user.complete = true;
			user.save();
			req.session.passport.user = user;
			logger.info(`${user.username} (${user._id}) updated profile`);
			res.redirect('/portal')
		})
	} else {
		logger.error('Failed to update profile');
		res.redirect('/auth')
	}
};

// send user a message with password
module.exports.sendPwrdMsg = (req, res, next) => {
	if(req.body.email){
		User.findOne(req.body, (err, user) => {
			if(err){
				res.send("User with this email does not exist")
			} else {
				if(user){
					let secret = user.email + '|' + new Date().toString();
					user.password.reset.hash = encrypt(secret);

					let emailOptions = {
						to: user.email,
						subject: 'Photolite password reset',
						html: `<h1>Hello from Photolite Academy</h1><p>Here is a <a href=/"${process.env.HOST + '/auth/local/reset/' + user.password.reset.hash}/">link</a> to reset your password. Do not share this link to anyone.</p><p>${process.env.HOST + '/auth/local/reset/' + user.password.reset.hash}</p>`
					};

					sendMail(emailOptions, (err, info) => {
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
};

// Confirm user
module.exports.confirmUser = (req, res, next) => {
	if (req.params.code) {
		let email = decrypt(req.params.code);
		if(email){
			User.findOne({email: email}, (err, user) => {
				user.verification.verified = true;
				user.verification.verificationLink = "";
				user.save();
				res.redirect('/auth')
			})
		}
	}
};

module.exports.doPwdReset = (req, res, next) => {
	try {
		let data = decrypt(req.params.code).split('|');
		let email = data[0];
		let now = new Date();
		let date = new Date(data[1]);

		let password = req.body.password;
		let password_2 = req.body.password_2;

		if(password === password_2){
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
						res.redirect('/auth');
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
};

module.exports.logout = (req, res, next) => {
	try {
		logger.info(`${req.user.username} (${req.user._id}) logged out`);
	}
	catch(e){}
	req.logout();
	res.redirect('/');
};