const nodemailer = require('nodemailer');
const logger = require('../logger/logger');

const transport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,              // TLS (google requires this port for TLS)
	secure: true,          // Not SSL
	auth: {
		type : 'OAuth2',
		user : process.env.GOG_CLIENT_EMAIL,
		serviceClient: process.env.GOG_CLIENT_ID,
		privateKey: process.env.GOG_PRIVATE_KEY
	}
});

module.exports.setUp = async () => {
	try {
		await transport.verify();
		await transport.sendMail({
			scope: 'https://mail.google.com',
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
	};

	transport.sendMail(email, (err, info) => {
		err ? logger.error(err) : logger.info(`Email has been sent to ${email.to}`)
	});
};