require('dotenv').config();

const sendMail = require('./service/email/mailTransporter');

let mailOptions = {
	to: 'skymailsenter@gmail.com',
	subject: 'Test email',
	html: 'This is a test email'
};

sendMail(mailOptions);