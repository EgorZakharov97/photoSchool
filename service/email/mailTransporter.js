const nodemailer = require('nodemailer');
const logger = require('/service/logger/logger');

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
		await transport.sendMail({
			from: process.env.GOG_CLIENT_EMAIL,
			to: 'skymailsenter@gmail.com',
			subject: 'Test email',
			text: 'This is a test message'
		})
	}
	catch(e) {
		console.log(e)
	}
};

module.exports.sendMail = (contents) => {
	let email = {
		from: process.env.GOG_CLIENT_EMAIL,
		to: contents.to,
		subject: contents.subject,
		text: contents.text
	}

	transport.sendMail(email, (err, info) => {
		err ? logger.error(err) : logger.info(`Email was sent to ${email.to}`)
	})
}