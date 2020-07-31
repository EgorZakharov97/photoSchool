const isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	User = require('../models/User'),
	Course = require('../models/Course'),
	logger = require('../service/logger/logger'),
	mailTransporter = require('../service/email/mailTransporter')(),
	controller = require('../controller/payment.controller'),
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
								currency: 'cad',
								product_data: {
									name: course.name,
									// images: [process.env.HOST + '/' + course.image]
								},
								unit_amount: course.pricing.discountPrice,
							},
							quantity: 1,
						}],
						mode: 'payment',
						success_url: 'http://localhost:3000/portal',
						cancel_url: 'http://localhost:3000/',
					});
					res.render('buy', {session: session.id, PK: process.env.STRIPE_PUBLIC})
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
	const sig = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhook.constructEvent(req.body, sig, process.env.STRIPE_WH);
	}
	catch(err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if(event.type === 'checkout.session.completed'){
		const session = event.data.object;

		console.log(session);
	}

	res.json({received: true});
};