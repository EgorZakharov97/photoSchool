const express = require('express'),
	genericController = require('../controller/generic.controller'),
	coursesController = require('../controller/courses.controller'),
	Challenge = require('../models/Challenge'),
	Tutorial = require('../models/Tutorial'),
	Material = require('../models/Material'),
	Preset = require('../models/Preset'),
	CategoryTutorial = require('../models/CategoryTutorial'),
	Course = require('../models/Course'),
	VideoCourse = require('../models/VideoCourse'),
	FileCourse = require('../models/FileCourse');

let router = express.Router();

router.get(
	'/challenges/head',
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getDataNames
);

router.get(
	'/challenges',
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getAllOfKind
);

router.get(
	'/challenge/:name',
	(req, res, next) => {req.DataClass = Challenge; next()},
	genericController.getDataObjectByName
);

router.get(
	'/tutorial/:name',
	(req, res, next) => {req.DataClass = Tutorial; next()},
	genericController.getDataObjectByName
);

router.get(
	'/tutorials/categories/head',
	(req, res, next) => {req.DataClass = CategoryTutorial; next()},
	genericController.getDataNames
);

router.get(
	'/material/:name',
	(req, res, next) => {req.DataClass = Material; next()},
	genericController.getDataObjectByName
);

router.get(
	'/preset/:name',
	(req, res, next) => {req.DataClass = Preset; next()},
	genericController.getDataObjectByName
);

router.get(
	'/course/:name',
	(req, res, next) => {req.DataClass = Course; next()},
	genericController.getDataObjectByName
);

router.get(
	'/course/:id/videos',
	(req, res, next) => {
		req.DataClass = VideoCourse;
		req.query = {course: req.params.id};
		next()
	},
	genericController.findObject
);

router.get(
	'/course/:id/files',
	(req, res, next) => {
		req.DataClass = FileCourse;
		req.query = {course: req.params.id};
		next()
	},
	genericController.findObject
);

module.exports = router;