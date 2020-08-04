const winston = require('winston'),
	Transport = require('winston-transport'),
	ConsoleLog = require('../../models/ConsoleLog');

// CUSTOM TRANSPORTER
class MailTransport extends Transport {
	constructor(opts) {
		super(opts);
		this.sendMail = require('../email/mailTransporter').sendMail;
	}

	log(info, callback) {
		setImmediate(() => {
			this.emit('logged', info);
		});
		let mailOptions = {
			to: 'skymailsenter@gmail.com',
			subject: 'Photolite.academy internal server error!',
			html: `<p>${info.timestamp}</p><p>${info.message}</p>`
		};
		this.sendMail(mailOptions);
		// Perform the writing to the remote service
		callback();
	}
}

class MailTransportWarn extends Transport {
	constructor(opts) {
		super(opts);
		this.sendMail = require('../email/mailTransporter').sendMail;
	}

	log(info, callback) {
		setImmediate(() => {
			this.emit('logged', info);
		});
		let mailOptions = {
			to: 'skymailsenter@gmail.com',
			subject: 'Photolite.academy Congratulations!',
			html: `<p>${info.timestamp}</p><p>${info.message}</p>`
		};
		this.sendMail(mailOptions);

		mailOptions.to = 'danyshumov@gmail.com';
		this.sendMail(mailOptions);

		mailOptions.to = 'admin@photolite.academy';
		this.sendMail(mailOptions);
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
logger.add(new MailTransportWarn({level: "warn"}));

module.exports = logger;