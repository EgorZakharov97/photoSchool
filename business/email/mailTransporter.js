const nodemailer = require('nodemailer');
const logger = require('../logger/logger');

let wasSet = false;

let transport = nodemailer.createTransport({
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

async function setup() {
	try {
		await transport.verify();
		wasSet = true;
	} catch (e) {
		logger.error(err);
	}
}

module.exports = async (contents) => {
	if(!wasSet){
		await setup()
	}

	if(wasSet){
		contents.from = process.env.EMAIL;
		transport.sendMail(contents, (err) => {
			err ? logger.error(err) : logger.info(`An email was sent to ${contents.to}`) ;
		})
	}
};