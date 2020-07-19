const nodemailer = require('nodemailer');

module.exports = () => {
	return nodemailer.createTransport({
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
	})
};