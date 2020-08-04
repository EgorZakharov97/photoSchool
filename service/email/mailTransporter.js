const nodemailer = require('nodemailer');
const logger = require('../logger/logger');

let mailer = {
	transport: nodemailer.createTransport({
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
	}),
	setup: async () => {
		try {
			await this.transport.verify();
			this.set = true;
			return true;
		} catch (e) {
			logger.error(e);
			return false;
		}
	},
	set: false
};


module.exports = (contents) => {

	if(mailer.set || mailer.setup()){
		let email = {
			from: process.env.EMAIL,
			to: contents.to,
			subject: contents.subject,
			html: contents.html
		};

		mailer.transport.sendMail(email, (err, info) => {
			try {
				err ? logger.error(err) : logger.info(`Email was sent to ${email.to}`)
			}
			catch(e) {
				console.log(e);
				err ? console.log(err) : console.log(`Email was sent to ${email.to}`)
			}
		})
	}
};