const express = require('express'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	controller = require('../controller/admin.controller'),
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	upload = require('../service/middleware/multer');
let router = express.Router();

router.route('/course/:id')
	.get(isAdmin, controller.getUpdateCourse)
	.post(isAdmin, controller.updateCourseInfo)
	.delete(isAdmin, controller.deleteCourse);

// router.route('/course/:id/videos')
// 	.post(isAdmin, controller.addVideo)
// 	.get(isAdmin, controller.getVideoManager);
//
// router.route('/course/:id/videos/:videoID')
// 	.delete(isAdmin, controller.deleteVideo)
// 	.put(isAdmin, controller.updateVideo);

router.route('/course')
	.get(isAdmin, controller.getCreateCourse)
	.post(isAdmin, upload.single('courseImage'), controller.createCourse);

router.route('/material')
	.get(isAdmin, controller.getCreateMaterial)
	.post(isAdmin, upload.any(), controller.createMaterial);

router.route('/material/:id')
	.get(isAdmin, controller.deleteMaterial);

router.route('/preset')
	.get(isAdmin, controller.getCreatePreset)
	.post(isAdmin, upload.any(), controller.createPreset);

router.route('/preset/:id')
	.get(isAdmin, controller.deletePreset);

router.route('/video')
	.get(isAdmin, controller.getCreateVideo)
	.post(isAdmin, controller.createVideo);

router.route('/video/:id')
	.get(isAdmin, controller.deleteVideo);

module.exports = router;