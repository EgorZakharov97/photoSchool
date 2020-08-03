const User = require('../models/User'),
	Course = require('../models/Course'),
	logger = require('../service/logger/logger'),
	Payment = require('../models/Payment'),
	sendMail = require('../service/email/mailTransporter').sendMail,
	stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports.preparePayment = (req, res, next) => {
	try {
		Course.findById(req.params.id, async (err, course) => {
			if(err){
				throw err;
			} else {
				if(course){
					const session = await stripe.checkout.sessions.create({
						payment_method_types: ['card'],
						line_items: [{
							price_data: {
								currency: 'usd',
								product_data: {
									name: course.name,
								},
								unit_amount: course.calculateCurrentPrice() * 100,
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
					res.render('buy', {session_id: session.id, PK: process.env.STRIPE_PUBLIC})
				} else {
					throw new Error('Payment failure: could not search for course ' + req.params.id)
				}
			}
		});
	}
	catch(err){
		logger.error(err);
		res.render('500').status(500);
	}
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
					user.save();

					let course = await Course.findById(payment.course);
					course.seats.occupied++;

					let emailOptions = {
						to: user.email,
						subject: 'PhotoLight Purchase Confirmation',
						html: `Thank you for buying ${course.name}. You have payed $${payment.session.amount_total / 100}CAD`
					};

					sendMail(emailOptions, (err, info) => {
						if (err) {
							logger.error(err)
						} else {
							logger.info(`Course purchase confirmation was sent to ${user.email}`);
						}
					});

				} else {
					logger.error(`Could not find payment with intent ${payment_intent}`);
					return res.status(500).end();
				}
			}
		})
	} else {
		return res.status(400).end();
	}
	res.json({received: true});
};