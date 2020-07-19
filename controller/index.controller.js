const express = require('express'),
	isAuthenticated = require('../service/middleware/authCheck').isAuthenticated,
	isAdmin = require('../service/middleware/authCheck').isAdmin,
	logger = require('../service/logger/logger');
let router = express.Router();

module.exports.getIndexPage = (req, res, next) => {
	res.render('index');
};