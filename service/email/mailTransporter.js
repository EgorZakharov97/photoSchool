const nodemailer = require('nodemailer');
const logger = require('../logger/logger');

const transport = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS
		},
		tls: {
			rejectUnauthorized: false
		}
});

module.exports.setUp = async () => {
	try {
		await transport.verify();
	}
	catch(e) {
		logger.error(e);
	}
};

module.exports.sendMail = (contents) => {
	let email = {
		from: process.env.GOG_CLIENT_EMAIL,
		to: contents.to,
		subject: contents.subject,
		html: contents.html
	};

	transport.sendMail(email, (err, info) => {
		err ? logger.error(err) : logger.info(`Email was sent to ${email.to}`)
	})
};