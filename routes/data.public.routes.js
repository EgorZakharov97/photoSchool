const express = require('express'),
	genericController = require('../controller/generic.controller'),
	Workshop = require('../models/Workshop'),
	Tutorial = require('../models/Tutorial'),
	Preset = require('../models/Preset'),
	Material = require('../models/Material'),
	Course = require('../models/Course');

let router = express.Router();

router.get(
	'/workshops',
	(req, res, next) => {req.DataClass = Workshop; next()},
	genericController.getAllOfKind
);

router.get(
	'/workshops/head',
	(req, res, next) => {req.DataClass = Workshop; next()},
	genericController.getDataNames
);

router.get(
	'/workshop/:name',
	(req, res, next) => {console.log(req.get('Authentication'));req.DataClass = Workshop; next()},
	genericController.getDataObjectByName
);

router.get(
	'/tutorials/head',
	(req, res, next) => {req.DataClass = Tutorial; next()},
	genericController.getDataNames
);

router.get(
	'/materials/head',
	(req, res, next) => {req.DataClass = Material; next()},
	genericController.getDataNames
);

router.get(
	'/presets/head',
	(req, res, next) => {req.DataClass = Preset; next()},
	genericController.getDataNames
);

router.get(
	'/courses/head',
	(req, res, next) => {req.DataClass = Course; next()},
	genericController.getDataNames
);

module.exports = router;