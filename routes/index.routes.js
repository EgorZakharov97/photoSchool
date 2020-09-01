const express = 	require('express'),
	controller = 	require('../controller/index.controller');
let router = 		express.Router();

router.route('/')
	.get(controller.getIndexPage);

router.get('/privacyPolicy', (req, res) => {
	res.render('privacy-policy')
});

router.get('/termsAndConditions', (req, res) => {
	res.render('terms-and-conditions')
});

router.get('/returnPolicy', (req, res) => {
	res.render('return-policy')
});

router.get('/disclaimer', (req, res) => {
	res.render('disclaimer')
});

router.route('/review/:email')
	.get(controller.getReviewPage)
	.post(controller.postReview);

router.route('/leave-email')
	.post(controller.leaveEmail);

router.route('/workshops')
	.get(controller.getWorkshopsPage)
	.post(controller.getWorkshops)

router.route('/cubscription')
	.get();

router.route('/courses')
	.get();

router.route('/community')
	.get();

module.exports = router;