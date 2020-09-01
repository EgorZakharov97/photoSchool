const User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Workshop = require('../models/Workshop'),
	Course = require('../models/Course'),
	Material = require('../models/Material'),
	Preset = require('../models/Preset'),
	Video = require('../models/Video');

async function renderPortalForAdmin(req, res, next) {

	let courses = await Course.find({});
	let materials = await Material.find({});
	let presets = await Preset.find({});
	let allVideos = await Video.find({});
	let categories = await Video.distinct('category');
	let user = await User.findById(req.user);
	req.session.passport.user = user;

	let videos = {};

	categories.filter(cat => {
		videos[cat] = []
	});

	allVideos.filter(video => {
		videos[video.category].push(video);
	});

	res.render('portal', {
		user: req.user,
		courses: courses,
		materials: materials,
		presets: presets,
		videos: videos,
		categories: categories
	})
}

async function renderPortalForUser(req, res, next) {
	let user = await User.findById(req.user._id);
	let courses = await Course.find({_id: user.courses});
	req.session.passport.user = user;
	let materials = [];
	let videos = [];
	let presets = [];
	let categories;
	let allVideos = [];

	if(user.courses.length >= 1){
		materials = await Material.find({});
		presets = await Preset.find({});
		allVideos = await Video.find({
			$or: [ {accessBySubscription: false}, {$and: [ {accessBySubscription: true}, {courses: []} ]}, {courses: {$in: user.courses}} ]
		});

	} else {
		allVideos = await Video.find({accessBySubscription: false});
	}

	categories = await Video.distinct('category');

	videos = {};

	categories.filter(cat => {
		videos[cat] = []
	});

	allVideos.filter(video => {
		videos[video.category].push(video);
	});

	res.render('portal', {
		user: req.user,
		courses: courses,
		materials: materials,
		presets: presets,
		videos: videos,
		categories: categories
	})
}

module.exports.getPortal = (req, res, next) => {
	res.render('members-portal');
};

module.exports.getWorkshops = (req, res, next) => {
	User.findById(req.user._id, (err, user) => {
		if(err) logger.error(err) && res.status(500) && res.render('500');
		if(user){
			Workshop.find({
				users: {$in: req.user._id}
			}, (err2, workshops) => {
				if(err2) logger.error(err) && res.status(500) && res.render('500');
				res.json(workshops);
			})
		}
	})
};

module.exports.getCourses = (req, res, next) => {
	let subscriptions = req.user.subscriptions;
	if(subscriptions) {
		let latest = subscriptions[subscriptions.length-1]
		Course.find({}, (err, courses) => {
			if(err) logger.error(err) && res.status(500) && res.render(500);
			res.json(courses);
		})
	} else {
		let courseIDs = req.user.courses;
		if(coursesIDs) {
			Course.find({_id: {$in: courseIDs}}, (err, courses) => {
				if(err) logger.error(err) && res.status(500) && res.render(500);
				res.json(courses);
			})
		} else {
			res.json({});
		}
	}
};

function checkSubscription() {

}


module.exports.getVideos = (req, res, next) => {
	let subscriptions = req.user.subscriptions;
	if(subscriptions) {
		let latest = subscriptions[subscriptions.length-1];
		Course.find({}, (err, courses) => {
			if(err) logger.error(err) && res.status(500) && res.render(500);
			res.json(courses);
		})
	} else {
		let courseIDs = req.user.courses;
		if(coursesIDs) {
			Course.find({_id: {$in: courseIDs}}, (err, courses) => {
				if(err) logger.error(err) && res.status(500) && res.render(500);
				res.json(courses);
			})
		} else {
			res.json({});
		}
	}
};