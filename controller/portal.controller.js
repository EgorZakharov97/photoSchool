const User = require('../models/User'),
	logger = require('../service/logger/logger'),
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
	let user = req.user;
	let courses = await Course.find({_id: user.courses});
	let materials = [];
	let videos;
	let presets = [];
	let categories = [];

	materials = await Material.find({});
	presets = await Preset.find({});

	let allVideos = await Video.find({
		$or: [ {accessBySubscription: false}, {$and: [ {accessBySubscription: true}, {courses: []} ]}, {courses: {$in: user.courses}} ]
	});
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
	let user = req.user;
	if(user.admin){
		renderPortalForAdmin(req, res, next);
	} else {
		renderPortalForUser(req, res, next);
	}
};