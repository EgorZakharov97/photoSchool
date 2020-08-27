const Course = 		require('../models/Course'),
	Material = 		require('../models/Material'),
	Video =			require('../models/Video'),
	logger = 		require('../service/logger/logger'),
	Preset = 		require('../models/Preset'),
	Coupon = 		require('../models/Coupon'),
	fs = 			require('fs');


module.exports.getCouponManager = (req, res, next) => {
	Coupon.find({}, (err, coupons) => {
		if(err){
			logger.error('Could not search for coupons');
			res.status(500);
			res.end();
		} else {
			res.render('admin-coupons', {
				coupons: coupons
			})
		}
	})
};

module.exports.getUpdateCourse = (req, res, next) => {
	Course.findById(req.params.id, (err, course) => {
		if(err){
			logger.error(err);
		} else {
			if(course){
				res.render('admin-course', {
					newCourse: false,
					course: course
				})
			} else {
				res.redirect('/admin/course')
			}
		}
	})
};

module.exports.getCreateCourse = (req, res, next) => {
	res.render('admin-course', {
		newCourse: true
	})
};

module.exports.createCoupon = (req, res, next) => {
	let name = req.body.name;
	let code = req.body.code;
	let expires;
	req.body.shouldExpire ? expires = req.body.expires : expires = false;
	let singleUse;
	req.body.usage === 'onetime' ? singleUse = true : singleUse = false;
	let discount = req.body.discount;

	let couponData = {};
	couponData.name = name;
	couponData.code = code;
	couponData.wasUsed = 0;
	expires ? couponData.expiryDate = new Date(expires).toUTCString() : false;
	couponData.singleUse = singleUse;
	couponData.discount = discount;

	Coupon.create(couponData, (err, newCoupon) => {
		if(err){
			logger.error('Could not create new coupon');
			res.status(500);
			res.end();
		} else {
			res.redirect('/admin/coupon');
		}
	})

};

module.exports.deleteCoupon = (req, res, next) => {
	Coupon.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			logger.error('Cound not search for a coupon');
			res.status(500);
			res.end();
		} else {
			res.redirect('/admin/coupon');
		}
	})
};

module.exports.createCourse = (req, res, next) => {
	let newCourseData =  {
		name: req.body.name,
		importantDates: {
			courseStarts: new Date(req.body.courseStarts).toUTCString(),
			courseEnds: new Date(req.body.courseEnds).toUTCString(),
			discountDeadline: new Date(req.body.registrationDeadline1).toUTCString(),
			registrationDeadline: new Date(req.body.registrationDeadline2).toUTCString()
		},
		pricing: {
			finalPrice: req.body.priceAfter
		},
		seats: {
			total: req.body.numPlaces,
			occupied: 0
		},
		richText: {
			description: req.body.description,
			timeline: req.body.timeline,
			willLearn: req.body.willLearn
		}
	};

	req.body.chatLink ? newCourseData.chatLink = req.body.chatLink : true;
	req.file ? newCourseData.image = req.file.path.replace(/\\/g, '/').trim() : true;

	Course.create(newCourseData, (err, course) => {
		if(err){
			logger.error(err);
			console.log(req.body);
			res.render('500').status(500);
		} else {
			logger.info("Course " + course.name + " has been successfully created (id=" + course._id + ").");
			res.redirect('/portal');
		}
	})
};

module.exports.updateCourseInfo = (req, res, next) => {
	let updatedData =  {
		name: req.body.name,
		importantDates: {
			courseStarts: new Date(req.body.courseStarts).toUTCString(),
			courseEnds: new Date(req.body.courseEnds).toUTCString(),
			discountDeadline: new Date(req.body.registrationDeadline1).toUTCString(),
			registrationDeadline: new Date(req.body.registrationDeadline2).toUTCString()
		},
		pricing: {
			discountPrice: req.body.priceBefore,
			finalPrice: req.body.priceAfter
		},
		'seats.total': req.body.numPlaces,
		richText: {
			description: req.body.description,
			timeline: req.body.timeline,
			willLearn: req.body.willLearn
		}
	};
	req.body.chatLink ? updatedData.chatLink = req.body.chatLink : true;

	Course.findByIdAndUpdate(req.params.id, {$set: updatedData}, (err, course) => {
		if(err){
			logger.error(err);
		} else {
			if(course){
				logger.info(`Course ${course.name} has been successfully updated`);
				res.redirect('/portal');
			} else {
				logger.error("Failed to lookup course to update");
				res.render('500').status(500);
			}
		}
	})
};

module.exports.deleteCourse = (req, res, next) => {
	Course.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			logger.error(err)
		} else {
			res.send(`Course ${req.params.id} was successfully removed`)
		}
	})
};

module.exports.getVideoManager = (req, res, next) => {
	Course.findById(req.params.id).populate('videos').exec((err, course) => {
		if(err){
			logger.error(err);
		} else {
			if(course){
				res.render('admin-add-videos', {
					course: course
				})
			}
		}
	})
};

module.exports.deleteVideo = (req, res, next) => {
	Video.findByIdAndRemove(req.params.videoID, (err) => {
		if(err) {
			logger.error(err);
		} else {
			logger.info("Admin has deleted a video");
		}
	});
	res.redirect('back');
};

module.exports.updateVideo = (req, res, next) => {
	Video.findOneAndUpdate({_id: req.params.videoID}, req.body, (err, video) => {
		if(err) {
			logger.error(err);
		} else {
			if(video){
				res.redirect('back')
			} else {
				res.send('There is no such video')
			}
		}
	})
};

module.exports.addVideo = (req, res, next) => {
	Course.findById(req.params.id, (err, course) => {
		if(err) {
			logger.error(err);
		} else {
			if(course){
				Video.create(req.body, (err2, video) => {
					if(err){
						logger.error(err);
					} else {
						course.videos.push(video);
						course.save();
						logger.info("Admin has added a video for " + course.name);
						res.redirect('back');
					}
				})
			}
		}
	})
};

module.exports.getCreatePreset = (req ,res, next) => {
	res.render('admin-preset')
};

module.exports.createPreset = (req, res, next) => {
	try {
		let preset = {
			name: req.body.name,
		};

		for(let i = 0; i < req.files.length; i++){
			let file = req.files[i];
			file.fieldname === 'picture' ? preset.image = file.path.replace(/\\/g, '/').trim() : preset.file = file.path.replace(/\\/g, '/').trim();
		}

		Preset.create(preset, (err, newPreset) => {
			if(err){
				logger.error(err);
				res.render('500').status(500);
			} else {
				logger.info(`Preset ${newPreset.name} was created`);
				res.redirect('/portal');
			}
		})
	}
	catch(e){
		logger.error(e);
		res.render('500').status(500);
	}
};

module.exports.deletePreset = (req, res, next) => {
	Preset.findById(req.params.id, (err, toRemove) => {
		if(err){
			logger.error(err);
			res.render('500').status(500);
		} else {
			let imagePath = toRemove.image;
			let filePath = toRemove.file;

			try {
				fs.unlinkSync(imagePath);
				fs.unlinkSync(filePath);
			}
			catch(e){
				logger.error('Couldnot find files to delete');
			}
			toRemove.remove();

			logger.info(`Preset ${toRemove.name} was removed`);
			res.redirect('/portal');
		}
	})
};

module.exports.getCreateMaterial = (req, res, next) => {
	res.render('admin-material');
};

module.exports.createMaterial = (req, res, next) => {
	try {
		let material = {
			name: req.body.name,
		};

		for(let i = 0; i < req.files.length; i++){
			let file = req.files[i];
			file.fieldname === 'picture' ? material.image = file.path.replace(/\\/g, '/').trim() : material.file = file.path.replace(/\\/g, '/').trim();
		}

		Material.create(material, (err, newMaterial) => {
			if(err){
				logger.error(err);
				res.render('500').status(500);
			} else {
				logger.info(`Reading ${newMaterial.name} was created`);
				res.redirect('/portal');
			}
		})
	}
	catch(e){
		logger.error(e);
		res.render('500').status(500);
	}
};

module.exports.deleteMaterial = (req, res, next) => {
	Material.findById(req.params.id, (err, toRemove) => {
		if(err){
			logger.error(err);
			res.render('500').status(500);
		} else {
			let imagePath = toRemove.image;
			let filePath = toRemove.file;

			try{
				fs.unlinkSync(imagePath);
				fs.unlinkSync(filePath);
			}
			catch(e){
				logger.error('Could not find file to delete');
			}

			toRemove.remove();

			logger.info(`Material ${toRemove.name} was removed`);
			res.redirect('/portal');
		}
	})
};

module.exports.getCreateVideo = (req, res, next) => {
	Course.find({}, 'name', (err, courses) => {
		if(err){
			logger.error(err);
			res.render('500').status(500);
		} else {
			res.render('admin-videos', {courses: courses})
		}
	})
};

module.exports.createVideo = (req, res, next) => {
	try {
		let videoR = {
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			URL: req.body.link.replace('560', '400').replace('315', '230'),
		};

		switch (req.body.whoCanAccess) {
			case 'everyone':
				videoR.accessBySubscription = false;
				break;

			case 'subscription':
				videoR.accessBySubscription = true;
				break;

			case 'course':
				videoR.accessBySubscription = true;
				videoR.courses = req.body.courseAccess;
				break;

			default:
				throw new Error('Unexpected access parameter');
		}

		Video.create(videoR, (err, video) => {
			if(err){
				throw err;
			} else {
				logger.info(`Video ${video.name} just was created`);
				res.redirect('/portal');
			}
		})
	}
	catch(e){
		logger.error(e);
		res.render('500').status(500);
	}
};

module.exports.deleteVideo = (req, res, next) => {
	Video.findById(req.params.id, (err, video) => {
		if(err){
			logger.error(err);
			res.render('500').status(500);
		} else {
			video.remove();
			logger.info(`Video ${video.name} was deleted`);
			res.redirect('/portal');
		}
	})
};