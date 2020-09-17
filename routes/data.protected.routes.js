const express = require('express'),
	genericController = require('../controller/generic.controller'),
	userDataController = require('../controller/userData.controller'),
	passport = require('passport'),
	Challenge = require('../models/Challenge'),
	Tutorial = require('../models/Tutorial'),
	Material = require('../models/Material'),
	Preset = require('../models/Preset'),
	CategoryTutorial = require('../models/CategoryTutorial'),
	Course = require('../models/Course'),
	VideoCourse = require('../models/VideoCourse'),
	FileCourse = require('../models/File');

let router = express.Router();

router.get(
	'/portalFiles/presets/:id',
	// passport.authenticate('jwt', {session: false}),
	userDataController.downloadPreset
);

router.get(
	'/workshops',
	passport.authenticate('jwt', {session: false}),
	userDataController.getWorkshops,
	genericController.getListOfObjectsByIds
);

router.get(
	'/materials',
	passport.authenticate('jwt', {session: false}),
	userDataController.getMaterials,
	genericController.manageSubscriptionAndServe
);

router.get(
	'/presets',
	passport.authenticate('jwt', {session: false}),
	userDataController.getPresets,
	genericController.manageSubscriptionAndServe
);

router.get(
	'/challenges/head',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getDataNames
);

router.get(
	'/challenges',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getAllOfKind
);

router.get(
	'/challenge/:name',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getDataObjectByName
);

router.get(
	'/tutorial/:name',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Tutorial; next()},
	genericController.getDataObjectByName
);

router.get(
	'/tutorials/categories/head',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = CategoryTutorial; next()},
	genericController.getDataNames
);

router.get(
	'/material/:name',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Material; next()},
	genericController.getDataObjectByName
);

router.get(
	'/preset/:name',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Preset; next()},
	genericController.getDataObjectByName
);

router.get(
	'/course/:name',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {req.DataClass = Course; next()},
	genericController.getDataObjectByName
);

router.get(
	'/course/:id/videos',
	passport.authenticate('jwt', {session: false}),
	(req, res, next) => {
		req.DataClass = VideoCourse;
		req.query = {course: req.params.id};
		next()
	},
	genericController.findObject
);

router.get(
	'/course/:id/files',
	 passport.authenticate('jwt', {session: false}),
	 passport.authenticate('jwt', {session: false}),
	(req, res, next) => {
		req.DataClass = FileCourse;
		req.query = {course: req.params.id};
		next()
	},
	genericController.findObject
);

module.exports = router;