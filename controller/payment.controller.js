const User = require('../models/User'),
	Course = require('../models/Course'),
	logger = require('../service/logger/logger'),
	Payment = require('../models/Payment'),
	sendMail = require('../service/email/mailTransporter');

let stripe, PK, WH;

if(process.env.NODE_ENV === 'development'){
	stripe = require('stripe')(process.env.STRIPE_SECRET_DEV);
	PK = process.env.STRIPE_PUBLIC_DEV;
	WH = process.env.STRIPE_WH_DEV;
} else {
	stripe = require('stripe')(process.env.STRIPE_SECRET_DEV);
	PK = process.env.STRIPE_PUBLIC_DEV;
	WH = process.env.STRIPE_WH_DEV;
}

module.exports.preparePayment = (req, res, next) => {
	Course.findById(req.params.id, async (err, course) => {
		if(err){
			logger.error(err);
			res.status(500);
			res.render('500');
		} else {
			if(course){
				if(course.seats.total <= course.seats.occupied){
					logger.error(`Purchase denied: ${course.name} has no more spots`);
					res.status(500);
					res.render('500');
				} else if(course.registrationDeadline >= Date.now() - 172800000) {
					logger.error(`Purchase denied: ${course.name} registration deadline has passed`);
					res.status(500);
					res.render('500');
				} else {
					// calculate user discount multiplier which is the reverse of discount
					let user = await User.findById(req.user._id);
					let multiplier = user.getPriceMultiplier();
					let price;
					if(multiplier === 0){
						price = 50
					} else {
						price = course.calculateCurrentPrice() * 100 * multiplier
					}

					const session = await stripe.checkout.sessions.create({
						payment_method_types: ['card'],
						line_items: [{
							price_data: {
								currency: 'cad',
								product_data: {
									name: course.name,
								},
								unit_amount: price,
							},
							quantity: 1,
						}],
						mode: 'payment',
						success_url: process.env.HOST + '/portal',
						cancel_url: process.env.HOST,
					});

					Payment.create({
						user: req.user._id,
						course: course._id,
						timeCreated: new Date(),
						received: false,
						session: session,
						intent: session.payment_intent
					});
					res.render('buy', {session_id: session.id, PK: PK})
				}
			} else {
				logger.error('Payment failure: course is unavailable:' + req.params.id);
				res.status(500);
				res.render('500');
			}
		}
	});
};

module.exports.success = (req, res, next) => {
	let event = req.body;
	let payment_intent = event.data.object.charges.data[0].payment_intent;

	if(event.type === 'payment_intent.succeeded'){
		Payment.findOne({intent: payment_intent}, async (err, payment) => {
			if(err){
				logger.error(err);
				return res.status(500).end();
			} else {
				if(payment){
					let today = new Date();
					payment.received = true;
					payment.save();

					let user = await User.findById(payment.user);
					user.courses.push(payment.course);
					user.subscriptionEnds = new Date(today.setMonth(today.getMonth()+1));
					user.discount.discountCount = (user.discount.discountCount+1) % 5;
					user.markModified('discount.discountCount');
					user.save();

					let course = await Course.findById(payment.course);
					course.seats.occupied++;
					course.save();

					let emailOptions = {
						to: user.email,
						subject: 'PhotoLight Purchase Confirmation',
						html: `Thank you for buying ${course.name}. You have paid $${payment.session.amount_total / 100}CAD`
					};

					sendMail(emailOptions);

					logger.warn(`!!!Congratulations!!! User ${user.email} purchased course ${course.name}`);

					let sayToAdmin = {
						to: 'skymailsenter@gmail.com',
						subject: 'Congratulations!',
						html: `<h1>Congratulations</h1><p>User ${user.name} with email ${user.email} just bought course ${course.name} for ${payment.session.amount_total / 100}</p>`
					};

					sendMail(sayToAdmin);

					sayToAdmin.to = 'admin@photolite.academy';
					sendMail(sayToAdmin);

				} else {
					logger.error(`Could not find payment with intent ${payment_intent}`);
					return res.status(500).end();
				}
			}
		})
	} else {
		logger.error(`Payment error: got unknown payment intent: ${event.type}`);
		return res.status(400).end();
	}
	res.json({received: true});
};