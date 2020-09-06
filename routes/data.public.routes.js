const express = require('express'),
	wk_controller = require('../controller/workshops.controller'),
	tut_controller = require('../controller/tutorials.controller'),
	mt_controller = require('../controller/materials.controller'),
	ps_controller = require('../controller/presets.controller');

let router = express.Router();

router.get('/workshops', wk_controller.getWorkshops);
router.get('/workshops/past', wk_controller.getPastWorkshops);
router.get('/workshops/head', wk_controller.getWorkshopNames);
router.get('/workshop/:name', wk_controller.getWorkshop);

// router.get('/tutorials', wk_controller.getTutorials);
router.get('/tutorials/head', tut_controller.getTutorialNames);
router.get('/tutorial/:name', tut_controller.getTutorial);
router.get('/tutorials/categories/head', tut_controller.getCategoryNames);

router.get('/materials/head', mt_controller.getMaterialNames);
router.get('/material/:name', mt_controller.getMaterial);

router.get('/presets/head', ps_controller.getPresetNames);
router.get('/preset/:name', ps_controller.getPreset);

module.exports = router;