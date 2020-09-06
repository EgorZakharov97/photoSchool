require('dotenv').config();

const sendMail = require('./business/email/mailTransporter'),
	ejs = require('ejs'),
	fs = require('fs');

fs.readFile('./service/email/templates/payment-confirmation.html', 'utf-8', (err, data) => {
	if (err) {
		logger.error(err);
		res.status(500);
		res.render('500');
	} else {
		const message = ejs.render(data, {
			username: "Egor Zakharov",
			courseDescription: "<p></p><br>Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph. A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long. Ultimately, a paragraph is a sentence or group of sentences that support one main idea. In this handout, we will refer to this as the “controlling idea,” because it controls what happens in the rest of the paragraph.".replace(/(<([^>]+)>)/gi, ""),
			courseName: "Course with a pretty name",
			coursePrice: "120",
			courseImage: "https://photolite.academy/public/images/course/Introduction to Portaraiture .jpg"
		});

		let emailOptions = {
			to: 'skymailsenter@gmail.com',
			subject: 'PhotoLight Purchase Confirmation',
			html: message
		};

		sendMail(emailOptions);
	}
});