const crypto = require('crypto'),
	algorithm = 'aes-256-ctr';

module.exports.encrypt = (string) => {
	let iv = crypto.randomBytes(16);
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.AUTH_LOCAL_RESET_KEY), iv);
	let encrypted = cipher.update(string);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + '|' + encrypted.toString('hex');
};

module.exports.decrypt = (code) => {
	let codeParts = code.split('|');
	let iv = Buffer.from(codeParts.shift(), 'hex');
	let encryptedText = Buffer.from(codeParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.AUTH_LOCAL_RESET_KEY), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};