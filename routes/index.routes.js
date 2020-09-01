const express = require('express'),
	Workshops = require('../models/Workshop'),
	controller = require('../controller/index.controller');

let router = express.Router();

router.get('/workshops', controller.getWorkshops);
router.get('/workshops/past', controller.getPastWorkshops);
router.get('/workshops/head', controller.getWorkshopNames);

router.get('/workshop/:name', controller.getWorkshop);

module.exports = router;