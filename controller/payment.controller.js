const User = require('../models/User'),
	logger = require('../business/logger/logger'),
	errors = require('../business/errors/Errors'),
	payments = require('../business/service/payments');

module.exports.subscribe = async (req ,res, next) => {
	let user = await User.findOne({email: req.body.email});
	if(!user){
		user = await User.create({
			email: req.body.email
		});
		user.setPassword(req.body.password);
		user.save();
	} else if (!user.validatePassword(req.body.password)) return next(new Error("Wrong Password"));

	let client = {};
	if(req.body.paymentMethodId) client = await payments.attachPaymentMethod(user, req.body.paymentMethodId);
	else client = await payments.getClientId(user);

	payments.createSubscription(user, req.body.priceId)
		.then(subscription => {

			res.send(subscription)
		})
		.catch(err => {
			if(err.constructor.name === "SubscriptionGrantError"){
				logger.info(`User ${user.username} tried to subscribe but already has subscription`);
				res.json({error: "You are already subscribed"})
			} else {
				res.json({error: {message: err.msg}})
			}
		});
};

module.exports.webhook = (req ,res, next) => {

};