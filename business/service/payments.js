const User = require('../../models/User'),
	Course = require('../../models/Course'),
	logger = require('../logger/logger'),
	Payment = require('../../models/Payment'),
	Coupon = require('../../models/Coupon'),
	sendMail = require('../email/mailTransporter'),
	ejs = require('ejs'),
	errors = require('../errors/Errors');

const stripe = require('stripe')(process.env.STRIPE_SECRET),
	PK = process.env.STRIPE_PUBLIC,
	WH = process.env.STRIPE_WH;

// Throws TypeError, Error
module.exports.getDiscountFromCoupon = getDiscountFromCoupon;
function getDiscountFromCoupon(couponCode, product, increment=false) {

	if(typeof couponCode !== 'string') throw new TypeError(`Coupon should be a string, received ${typeof couponCode}`);
	if(typeof product !== 'string') throw new TypeError(`Product should be a string, received ${typeof product}`);

	Coupon.findOne({code: couponCode}, (err, coupon) => {
		if(err) throw err;
		if(!coupon) return 0;
		if (!((coupon.singleUse && coupon.wasUsed > 0) || coupon.expiryDate.getTime() >= Date.now())){
			return 0;
		} else {
			if(product !== coupon.product) throw new error.IncompatibleCouponError(coupon, product);
			if(increment) coupon.wasUsed++ && coupon.save();
			return coupon.discount;
		}
	})
}

// Throws Error, ResourceNotFoundError, ProductAvailabilityError
module.exports.buyProduct = (userID, productID, coupon=null, Product) => {

	switch (Product.constructor.name) {
		case "Workshop":
			return Product.findById(productID, validateWorkshop);
		case "Course":
			return Product.findById(productID, validateCourse);
		default:
			throw new TypeError(`Unknown product type ${Product.constructor.name}`)
	}

	function validateCourse(err, course) {
		if(err) throw err;
		if(!course) throw new errors.ResourceNotFoundError(productID);
		if(!course.public) throw new errors.ProductAvailabilityError(`${course.name} is not public`);
		return calcProductPrice(course);
	}

	function validateWorkshop(err, workshop) {
		if(err) throw err;
		if(!workshop) throw new errors.ResourceNotFoundError(productID);
		if(
			(workshop.seats.total <= workshop.seats.occupied) ||
			(workshop.registrationDeadline.getTime() >= Date.now())
		) {
			throw new errors.ProductAvailabilityError(`${workshop.name} is no longer available`)
		}
		return calcProductPrice(workshop);
	}

	function calcProductPrice(product) {
		return User.findById(userID, (err, user) => {
			if(err) throw err;
			if(!user) throw new errors.ResourceNotFoundError(userID);

			let finalPrice = product.pricing.finalPrice * 100;
			if(Product.constructor.name === "Workshop"){
				let multiplier = user.getPriceMultiplier();
				if(multiplier === 0) {
					finalPrice = 50;
				} else {
					finalPrice *= multiplier;
				}
			}

			if(coupon) {
				let discountPercentage = getDiscountFromCoupon(coupon, Product.constructor.name, true);
				let discountMultiplier = 100 - discountPercentage;
				finalPrice *= discountMultiplier;
			}
			return preparePaymentForWorkshop(product, finalPrice)
		})
	}

	function preparePaymentForWorkshop(product, finalPrice) {
		stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [{
				price_data: {
					currency: 'cad',
					product_data: {
						name: product.name,
					},
					unit_amount: finalPrice,
				},
				quantity: 1,
			}],
			mode: 'payment',
			success_url: process.env.HOST + '/portal',
			cancel_url: process.env.HOST,
		}).then(session => {
			createDBPayment(session);
			return session;
		})
	}

	function createDBPayment(session, user) {
		Payment.create({
			user: user._id,
			course: productID,
			timeCreated: new Date(),
			received: false,
			session: session,
			intent: session.payment_intent
		}, (err, payment) => {
			if(err) throw err;
		})
	}
};

module.exports.getSubscriptionSession = async (user) => {
	return await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [{
			price: 'price_1HM4yaG6Hl2ceMlVRNe3z62p',
			quantity: 1,
		}],
		mode: 'subscription',
		success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
		cancel_url: 'https://example.com/cancel',
	});
};

// Receives user from Database
function getClientId(user) {
	if(typeof user !== 'object' || user.collection.collectionName !== 'users') throw new TypeError(`'user' must be of type a Mongoose object, received ${typeof user}`);

	if (user.stripeClient.clientId) return user.stripeClient.clientId;

	return stripe.customers.create({
		description: 'Photolite Academy Customer',
		email: user.email
	}).then(onStripeCustomer).catch(onStripeError);

	function onStripeCustomer(customer){
		user.stripeClient.clientId = customer.id;
		user.save();
		return customer;
	}

	function onStripeError(err) {
		throw err
	}
} module.exports.getClientId = getClientId;

module.exports.attachPaymentMethod = async (user, paymentMethodId) => {
	if(typeof user !== 'object' || user.collection.collectionName !== 'users') throw new TypeError(`'user' must be of type a Mongoose object, received ${typeof user}`);

	const clientId = await getClientId(user);
	
	try {
		await stripe.paymentMethods.attach(paymentMethodId, {
			customer: clientId
		});
	}
	catch (e) {
		throw e
	}

	const client = await stripe.customers.update(
		clientId,
		{
			invoice_settings: {
				default_payment_method: paymentMethodId,
			},
		}
	);

	user.stripeClient.defaultPaymentMethod = client.invoice_setting.default_payment_method;
	user.save();

	return clientId
};

module.exports.createSubscription = async (user, priceId) => {
	if(typeof user !== 'object' || user.collection.collectionName !== 'users') throw new TypeError(`'user' must be of type a Mongoose object, received ${typeof user}`);

	const clientId = getClientId(user);

	const activeSubscription = await stripe.subscriptions.list({
		customer: clientId,
		price: priceId,
		status: 'active'
	});
	// if (activeSubscription.data.length > 0){
	// 	throw new errors.SubscriptionGrantError(`Client with id ${client.id} already has active subscription for price ${priceId}`)
	// }

	const subscription = await stripe.subscriptions.create({
		customer: clientId,
		items: [
			{price: priceId},
		],
	});

	manageDBSubscriptions(user, subscription);
	return subscription;
};

function manageDBSubscriptions(user, subscription){
	switch (priceID) {
		case process.env.STRIPE_BASIC_SUBSCRIPTION:
			logger.info(`Subscription was updated for user ${user.username} (id: ${user._id})`);
			user.subscriptions.basic = {
				id: subscription.id,
				status: subscription.status
			};
			user.save();
			return;

		default:
			throw new errors.SubscriptionGrantError(`Unknown price id: ${priceID}`)
	}
}