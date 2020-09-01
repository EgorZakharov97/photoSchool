const User = require('../../models/User'),
	Subscription = require('../../models/Subscription'),
	errors = require('../errors/Errors');

module.exports.checkSubscription = async function(user) {
	if(user && user.subscriptions) {
		let latest = user.subscriptions[user.subscriptions.length-1];
		let subscription = await Subscription.findById(latest._id);
		return !!(subscription &&
			subscription.dateEnds >= Date.now());
	} else {
		return false;
	}
};

module.exports.issueSubscription = function(user) {
	if(typeof user === 'object') {
		User.find(user._id, (err, user) => {
			if(err) throw new Error(err2);
			if(user){
				let date = new Date();
				Subscription.create({
					user: user._id,
					type: "Standard",
					dateIssued: date,
					dateEnds: new Date(date.setMonth(date.getMonth()+1))
				}, (err2, subscription) => {
					if(err2) throw new Error(err2);
					if(subscription){
						user.subscriptions.push(subscription);
						user.markModified('subscriptions');
						user.save();
						return user;
					} else {
						throw new errors.SubscriptionGrantError("Could not create subscription");
					}
				})
			}
		})
	} else {
		throw new TypeError(`Should pass user object, received ${typeof user}`)
	}
};

module.exports.issueFreeSubscription = function(user) {
	if(typeof user !== 'object') throw new TypeError(`'user' should be an object, got ${typeof user}`);
	let date = new Date();
	return User.findById(user._id, async (err, user) => {
		if(err) throw err;
		if(!user) throw new errors.ResourceNotFoundError(`Could not find user with id ${user._id}`);
		if(
			await Subscription.findOne({
				type: "Free",
				user: user._id,
			})
		) {
			throw new errors.SubscriptionGrantError(`user ${user.username} email ${user.email} id ${user._id} already been granted a free subscription`);
		}
		return Subscription.create({
			user: user._id,
			type: "Free",
			dateIssued: date,
			dateEnds: new Date(date.setDate(date.getDate()+7))
		}, (err2, subscription) => {
			if(err2) throw err2;
			if(subscription){
				if(user.subscriptions){
					user.subscriptions.push(subscription)
				} else {
					user.subscriptions = [subscription]
				}
				user.markModified('subscriptions');
				user.save();
				return subscription;
			} else {
				throw new errors.SubscriptionGrantError('Could not create subscription')
			}
		})
	})
};