const User = require('../models/User'),
	Workshop = require('../models/Workshop'),
	Course = require('../models/Course'),
	Tutorial = require('../models/Tutorial'),
	CategoryTutorial = require('../models/CategoryTutorial'),
	DataClass = require('../models/Material'),
	Preset = require('../models/Preset'),
	Coupon = require('../models/Coupon'),
	errors = require('../business/errors/Errors'),
	logger = require('../business/logger/logger'),
	fileManager = require('../business/service/fileManager'),
	genericDataController = require('./genericData.controller');

module.exports.createWorkshop = async (req, res, next) => {
	const data = req.body;
	if(
		!(data.name &&
		data.starts &&
		data.ends &&
		data.deadline &&
		data.duration &&
		data.price &&
		(data.numPlaces || data.seats) &&
		data.description &&
		data.timeline &&
		data.willLearn)
	) {
		return next(new errors.IncompleteReqDataError(data))
	} else {
		const workshopData = {
			name: data.name,
			importantDates: {
				courseStarts: data.starts,
				courseEnds: data.ends,
				registrationDeadline: data.deadline
			},
			pricing: {
				finalPrice: data.price
			},
			seats: {
				total: data.seats,
			},
			duration: data.duration,
			richText: {
				description: data.description,
				timeline: data.timeline,
				willLearn: data.willLearn
			}
		};

		if(data.chatLink) workshopData.chatLink = data.chatLink;
		if(data._id) workshopData._id = data._id;

		if(workshopData._id){
			// Modify existing Workshop
			Workshop.findByIdAndUpdate(workshopData._id, workshopData, async (err, workshop) => {
				if(err) next(err);
				if(!workshop) next(new errors.ResourceNotFoundError(workshopData._id));
				res.data = workshop;

				if(req.files){
					workshop.image = await fileManager.saveFile(req.files[0], 'workshop', workshop._id);
					workshop.save();
				}

				res.msg = `Workshop '${workshop.name}' was successfully updated`;
				logger.info(`Workshop '${workshop.name}' was successfully updated`);
				next();
			})
		} else {
			// Create new workshop
			if(!req.files){
				next(new errors.IncompleteReqDataError(workshopData))
			} else {
				Workshop.create(workshopData, async (err, workshop) => {
					if(err) next(err);
					if(!workshop) return next(new Error('Server failed to create Workshop'));

					workshop.image = await fileManager.saveFile(req.files[0], 'workshop', workshop._id);
					workshop.save();

					logger.info(`Workshop '${workshop.name}' was successfully created`);

					res.data = workshop;
					res.msg = `Workshop '${workshop.name}' was successfully created`;
					next();
				})
			}
		}
	}
};

module.exports.createTutorial = async (req, res, next) => {
	let data = req.body;
	if(!(
		data.name &&
		data.description &&
		data.category &&
		data.link
	)) return next(new errors.IncompleteReqDataError(data));

	data.accessBySubscription = data.subscription;

	let category = await CategoryTutorial.findOne({name: data.category});
	if(!category) category = await CategoryTutorial.create({
		name: data.category,
		tutorials: []
	});
	data.category = category._id;

	if(data._id){
		// Modify existiong tutorial
		Tutorial.findByIdAndUpdate(data._id, data, async (err, tutorial) => {
			if(err) return next(err);
			if (!tutorial) return next(new errors.ResourceNotFoundError(data._id));

			if(data.files){
				tutorial.image = await fileManager.saveFile(req.files[0], 'tutorial', tutorial._id);
				tutorial.save();
			}

			logger.info(`Tutorial '${tutorial.name}' was successfully updated`);

			res.msg = `Tutorial '${tutorial.name}' was successfully updated`;
			next();

		})
	} else {
		// Create new workshop
		if(!req.files) return next(new errors.IncompleteReqDataError(data));
		Tutorial.create(data, async (err, tutorial) => {
			if(err) return next(err);
			if(!tutorial) return next(new Error('Server failed to create Tutorial'));

			tutorial.image = await fileManager.saveFile(req.files[0], 'tutorial', tutorial._id);
			tutorial.save();

			category.tutorials.push(tutorial._id);
			category.save();

			logger.info(`Workshop '${tutorial.name}' was successfully created`);

			res.data = tutorial;
			res.msg = `Workshop '${tutorial.name}' was successfully created`;
			next();
		})
	}
};

module.exports.createPreset = (req, res, next) => {
	let data = req.body;
	if (!(
		data.name && data.subscription
	)) return next(new errors.IncompleteReqDataError(data));

	data.accessBySubscription = data.subscription;

	createMaterialOrPreset(req, res, next, Preset)
};

module.exports.createMaterial = (req, res, next) => {
	let data = req.body;
	if (!(
		data.name && data.subscription
	)) return next(new errors.IncompleteReqDataError(data));

	data.accessBySubscription = data.subscription;

	createMaterialOrPreset(req, res, next, Material)
};

module.exports.getAllCoupons = (req, res, next) => {
	Coupon.find({}, (err, coupons) => {
		if(err) return next(err);
		res.data = coupons;
		next();
	})
};

module.exports.createCoupon = (req, res, next) => {
	let data = req.body;

	if(!(
		data.name &&
		data.code &&
		data.discount &&
		data.product &&
		data.usage
	)) return next(new errors.IncompleteReqDataError(data));

	if (data.expires) data.expiryDate = new Date(data.expires);
	data.singleUse = data.usage === 'onetime';
	data.wasUsed = 0;

	Coupon.create(data, (err, coupon) => {
		if(err) return next(err);
		if(!coupon) next(new Error('Could not create Coupon'));
		logger.info(`Coupon '${coupon.name}' was successfully created`);
		res.msg = `Coupon '${coupon.name}' was successfully created`;
		res.data = coupon;
		next();
	})
};

module.exports.deleteCoupon = (req, res, next) => {
	const id = req.params.id;
	Coupon.findByIdAndRemove(id, (err, coupon) => {
		if(err) return next(err);
		logger.info(`Coupon '${coupon.name}' was successfully removed`);
		res.msg = `Coupon '${coupon.name}' was successfully removed`;
		next();
	})
};

module.exports.createChallenge = (req, res, next) => {
	res.msg = 'OK'
	next()
};