const express = require('express'),
	stripe = require('stripe')(process.env.STRIPE_SECRET),
	PK = process.env.STRIPE_PUBLIC,
	WH = process.env.STRIPE_WH,
	axios = require('axios'),
	User = require('../models/User');

let router = express.Router();

router.get('/test', (req, res) => {
	res.render('test');
});

router.get('/test/session', async (req, res) => {
	const session = await require('../service/business/payments').getSubscriptionSession();
	res.json(session.id);
});

router.get('/test/page', (req, res) => {
	res.render('test')
});

router.get('/suka', async (req, res) => {
	let user = await User.findOne({email: "skymailsenter@gmail.com"})
	console.log(user.collection.collectionName)
	console.log(User.collection.collectionName)
});

module.exports = router;