const express = require('express'),
	isAuthenticated = require('../middleware/authCheck').isAuthenticated,
	isAdmin = require('../middleware/authCheck').isAdmin,
	logger = require('../tools/logger');
let router = express.Router();

router.get('/', (req, res) => {
	if(req.session.visits){
		req.session.visits++;
	} else {
		req.session.visits = 1;
	}

	if(req.isAuthenticated()){
		res.send(`<h1>Hello, ${req.user.displayName}</h1><p>You have ${req.session.visits} visits</p><a href=/auth/logout>Logout</a>`);
	} else {

		res.send(`<h1>Hello, user</h1><p>You have ${req.session.visits} visits</p><a href=/auth/google>Authenticate with google</a><br/><a href=/auth/local>Authenticate locally</a>`)
	}
});

router.get('/secret', isAuthenticated, (req, res) => {
	res.send("This is a protected page for authorized users");
});

router.get('/admin', isAdmin, (req, res) => {
	res.send("This is a protected page for admin");
});

module.exports = router;