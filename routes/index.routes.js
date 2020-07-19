const express = 	require('express'),
	controller = 	require('../controller/index.controller');
let router = 		express.Router();

router.route('/')
	.get(controller.getIndexPage);

// router.get('/secret', isAuthenticated, (req, res) => {
// 	res.send("This is a protected page for authorized users");
// });
//
// router.get('/admin', isAdmin, (req, res) => {
// 	res.send("This is a protected page for admin");
// });

module.exports = router;