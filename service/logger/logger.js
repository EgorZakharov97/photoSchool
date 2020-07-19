const winston = require('winston'),
	Transport = require('winston-transport'),
	ConsoleLog = require('../../models/ConsoleLog');

// CUSTOM TRANSPORTER
class MailTransport extends Transport {
	constructor(opts) {
		super(opts);
		this.transporter = require('../email/mailTransporter')();
	}

	log(info, callback) {
		setImmediate(() => {
			this.emit('logged', info);
		});
		let mailOptions = {
			to: process.env.EMAIL,
			from: process.env.EMAIL,
			subject: 'TuttiFashion internal server error!',
			html: `<p>${info.timestamp}</p><p>${info.message}</p>`
		};
		this.transporter.sendMail(mailOptions);
		// Perform the writing to the remote service
		callback();
	}
}

class DBTransport extends Transport {
	constructor(opts) {
		super(opts);

	}

	log(info, callback) {
		setImmediate(() => {
			this.emit('logged', info);
		});
		ConsoleLog.create(info);
		// Perform the writing to the remote service
		callback();
	}
}

// LOGGER
const logger = winston.createLogger({
	level: "silly",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.simple()
	),
	transports: [
		new winston.transports.File({filename: "info.log", level: "silly"}),
		new winston.transports.File({filename: "error.log", level: "error"})
	]
});
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		)
	}));
} else {
	logger.add(new MailTransport({level: "error"}));
	logger.add(new DBTransport({level: "silly"}));
}

module.exports = logger;