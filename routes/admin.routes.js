const express = require('express'),
	controller = require('../controller/admin.controller'),
	upload = require('multer')();

let router = express.Router();

router.route('/workshop')
	.get()
	.post(upload.array('assets'), controller.createWorkshop);

router.route('/tutorial')
	.post(upload.array('assets'), controller.createTutorial);

router.route('/material')
	.post(upload.array('assets'), controller.createMaterial);

router.route('/preset')
	.post(upload.array('assets'), controller.createPreset);

router.route('/coupons')
	.get(controller.getAllCoupons)
	.post(controller.createCoupon);

router.delete('/coupon/:id', controller.deleteCoupon);

router.route('/challenge')
	.post(upload.array('assets'), controller.createChallenge);

module.exports = router;