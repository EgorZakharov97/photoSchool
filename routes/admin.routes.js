const express = require('express'),
	controller = require('../controller/admin.controller'),
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	upload = require('../service/middleware/multer');
let router = express.Router();

router.route('/course/:id')
	.get(isAdmin, controller.getUpdateCourse)
	.post(isAdmin, controller.updateCourseInfo)
	.delete(isAdmin, controller.deleteCourse);

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

router.route('/coupon')
	.get(isAdmin, controller.getCouponManager)
	.post(isAdmin, controller.createCoupon);

router.route('/coupon/:id')
	.get(isAdmin, controller.deleteCoupon);

module.exports = router;