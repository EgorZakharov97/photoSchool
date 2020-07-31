const express = require('express'),
	passport = require('passport'),
	path = require('path'),
	User = require('../models/User'),
	logger = require('../service/logger/logger'),
	Course = require('../models/Course'),
	Material = require('../models/Material'),
	Preset = require('../models/Preset'),
	Video = require('../models/Video'),
	crypto = require('crypto'),
	mailTransporter = require('../service/email/mailTransporter')(),
	encrypt = require('../service/tools/encrypter').encrypt,
	decrypt = require('../service/tools/encrypter').decrypt,
	controller = require('../controller/auth.controller'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated;

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

function renderPortalForUser(req, res, next) {
	res.send("Only admin can view this page");
}

module.exports.getPortal = (req, res, next) => {
	let user = req.user;
	if(user.admin){
		renderPortalForAdmin(req, res, next);
	} else {
		renderPortalForUser(req, res, next);
	}
};