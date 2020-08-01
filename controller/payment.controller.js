const isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	User = require('../models/User'),
	Course = require('../models/Course'),
	logger = require('../service/logger/logger'),
	Payment = require('../models/Payment'),
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
								currency: 'usd',
								product_data: {
									name: 'T-shirt',
								},
								unit_amount: 2000,
							},
							quantity: 1,
						}],
						mode: 'payment',
						success_url: 'http://localhost:3000/portal',
						cancel_url: 'http://localhost:3000/',
					});

					Payment.create({
						user: req.user._id,
						course: course._id,
						timeCreated: new Date(),
						received: false,
						session: session
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
	console.log(event.data.object.charges.data[0].payment_intent);

	// switch(event.type) {
	// 	case 'payment_intent.succeeded':
	// 		logger.info("New payment received");
	// 		console.log(event);
	// 		break;
	// 	case 'payment_method.attached':
	// 		console.log(event);
	// 		break;
	// 	default:
	// 		console.log(event);
	// 		return res.status(400).end()
	// }

	res.json({received: true});
};