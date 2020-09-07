const express = require('express'),
	verification = require('../business/middleware/verification'),
	genericController = require('../controller/generic.controller'),
	Coupon = require('../models/Coupon'),
	Course = require('../models/Course'),
	VideoCourse = require('../models/VideoCourse'),
	FileCourse = require('../models/FileCourse'),
	upload = require('multer')();

let router = express.Router();

router.route('/workshop')
	.post(
		upload.array('assets'),
		verification.verifyWorkshop,
		genericController.createOrUpdateDataObject
	);

router.route('/tutorial')
	.post(
		upload.array('assets'),
		verification.verifyTutorial,
		genericController.createOrUpdateDataObject
	);

router.route('/material')
	.post(
		upload.array('assets'),
		verification.verifyMaterial,
		genericController.createOrUpdateDataObject
	);

router.route('/preset')
	.post(
		upload.array('assets'),
		verification.verifyPreset,
		genericController.createOrUpdateDataObject
	);

router.route('/coupons')
	.get(
		(req, res, next) => {req.DataClass = Coupon; next()},
		genericController.getAllOfKind
	)
	.post(
		verification.verifyCoupon,
		genericController.createOrUpdateDataObject
	);

router.delete(
	'/coupon/:id',
	(req, res, next) => {req.DataClass = Coupon; next()},
	genericController.deleteObjectById
);

router.route('/challenge')
	.post(
		upload.array('assets'),
		verification.verifyChallenge,
		genericController.createOrUpdateDataObject
	);

router.route('/course')
	.post(
		upload.array('assets'),
		verification.verifyCourse,
		genericController.createOrUpdateDataObject
	);

router.route('/course/video')
	.post(
		verification.verifyVideoCourse,
		genericController.createOrUpdateDataObject
	);

router.route('/course/file')
	.post(
		upload.array('assets'),
		verification.verifyFileCourse,
		genericController.createOrUpdateDataObject
	);

router.route('/course/examples')
	.post(
		upload.array('assets'),
		verification.verifyCourseExamples,
		(req, res, next) => {

		}
	);

router.delete(
	'/course/video/:id',
	(req, res, next) => {req.DataClass = VideoCourse; next()},
	genericController.deleteObjectById
);

router.delete(
	'/course/file/:id',
	(req, res, next) => {req.DataClass = FileCourse; next()},
	genericController.removeObjectFilesById,
	genericController.deleteObjectById
);

module.exports = router;