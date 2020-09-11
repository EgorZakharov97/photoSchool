const User = require('../models/User'),
	sendMail = require('../business/email/mailTransporter'),
	encrypt = require('../business/service/encrypter').encrypt,
	decrypt = require('../business/service/encrypter').decrypt,
	fs = require('fs'),
	logger = require('../business/logger/logger'),
	ejs = require('ejs'),
	errors = require('../business/errors/Errors');

module.exports.getGoogleLink = (req, res, next) => {

}

module.exports.confirmUser = (req, res, next) => {
	if(!req.params.code) return next(new errors.RuntimeError('The confirmation link was not found'));
	let email = decrypt(req.params.code);
	User.findOne({email: email}, (err, user) => {
		user.verification = {verified: true};
		user.save();
		res.msg = "You have been successfully verified";
		res.body = user.toAuthJSON();
		next()
	})
};

module.exports.register = (req, res, next) => {
	let profile = req.body;
	if(profile.password !== profile.password_2) return next(new errors.RuntimeError("Passwords does not match"))
	try {
		User.create({
			email: profile.email,
			username: profile.username,
			sex: profile.sex,
			verification: {
				verified: false,
				verificationLink: process.env.HOST + '/auth/confirm/' + encrypt(profile.email)
			},
			complete: true,
			experience: profile.experience,
			phoneNumber: profile.phoneNumber,
			comingFrom: 'local',
			admin: false,
			courses: []
		}, (err, newUser) => {
			if(err) return next(err);

			newUser.setPassword(profile.password);
			newUser.save();
			logger.info(`New user created: ${newUser.username}, id: ${newUser._id}`);

			fs.readFile('./business/email/templates/email-confirmation.html', 'utf-8', (err, data) => {
				if(err) return next(err);
				const message = ejs.render(data, {link: newUser.verification.verificationLink});

				// Sending verification email
				let emailOptions = {
					to: newUser.email,
					subject: 'Photolite email verification',
					html: message
				};
				sendMail(emailOptions);
				res.msg = "You have benn registered";
				next()
			})
		})
	}
	catch(e){
		next(e)
	}
};

module.exports.login = (req, res, next) => {
	User.findOne({email: req.body.email}, (err, user) => {
		if(err) return next(err);
		if(!user) return next(new errors.RuntimeError('User not found'));
		if(user.validatePassword(req.body.password)){
			logger.info(`User ${user.username} (email ${user.email}) logged in`);
			res.data = user.toAuthJSON();
			res.message = "You have been successfully authenticated";
			next()
		} else {
			logger.info(`User ${user.username} (email ${user.email}) entered wrong password`);
			return next(new errors.RuntimeError("Wrong password"))
		}
	})
};

module.exports.sendResetMessage = (req, res, next) => {
	if(!req.body.email) return next(new errors.IncompleteReqDataError({required: 'mail'}));
	User.findOne({email: req.body.email}, (err, user) => {
		if(err) return next(err);
		if(!user) return next(new errors.IncompleteReqDataError({required: 'email'}));

		let secret = user.email + '&' + new Date(Date.now() + 600000).getTime();
		user.password.reset.hash = encrypt(secret);

		fs.readFile('./business/email/templates/reset-password.html', 'utf-8', (err, data) => {
			if (err) return next(err);

			const message = ejs.render(data, {link: process.env.HOST + '/auth/reset/' + user.password.reset.hash});

			let emailOptions = {
				to: user.email,
				subject: 'Photolite password reset',
				html: message
			};

			sendMail(emailOptions);
			res.msg = "Email confirmation has been sent to your email";
			res.body = user.email;
			next()
		});
	});
};

module.exports.resetPassword = (req, res, next) => {
	try {
		let data = decrypt(req.body.secret).split('&');
		let email = data[0];
		let date = new Date(data[1]);

		let password = req.body.password;
		let password_2 = req.body.password_2;

		if(password !== password_2) return next(new errors.RuntimeError('Passwords does not match'));
		if(data >= Date.now()) return next(new errors.RuntimeError('Password reset link has expired. Please, try to reset password again'));

		User.findOne({email: email}, (err, user) => {
			if(err) return next(err);
			if(!user) return next(new errors.RuntimeError(`Failed to look up user with email ${email}`));
			user.setPassword(password);
			user.origin = 'local';
			user.save();
			logger.info(`User ${user.username} (${user._id}) has changes password`);
			res.msg = "Password was successfully reset. You are now authorized.";
			res.data = user.toAuthJSON();
			next()
		});

	} catch (e) {
		res.msg = "This URL is not valid. Please try to request your password again";
		next(new errors.RuntimeError("This URL is not valid. Please try to request your password again"));
	}
};

module.exports.updateUserInfo = (req, res, next) => {
	let profile = req.body;
	if(!profile.email) return next(new errors.IncompleteReqDataError({required: 'email'}));

	User.findOne({email: profile.email}, (err, user) => {
		user.username = profile.username;
		user.phoneNumber = profile.phoneNumber;
		user.experience = profile.experience;
		user.sex = profile.sex;
		user.complete = true;
		user.save();
		logger.info(`${user.username} (${user._id}) updated profile`);
		res.msg = "Profile was successfully updated";
		res.body = user.toAuthJSON();
		next();
	});
};