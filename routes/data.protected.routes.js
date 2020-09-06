const express = require('express'),
	genericController = require('../controller/genericData.controller'),
	Challenge = require('../models/Challenge');

let router = express.Router();

router.get('/challenges/head', (req, res, next) => {
	genericController.getDataNames(req, res, next, Challenge)
});

router.get('/challenge/:name', (req, res, next) => {
	genericController.getDataObjectByName(req, res, next, Challenge)
});

module.exports = router;