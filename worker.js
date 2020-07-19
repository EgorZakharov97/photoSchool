require('dotenv').config();

const express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	passport = require('passport');

// APP
const app = express();

// REQUIRED FUNCTIONS
const logger = require('./tools/logger');
const userStats = require('./middleware/userStats');

// ROUTES
const IndexRoutes = require('./routes');
const AnalyticsRoutes = require('./routes/Analytics');
const Authentication = require('./routes/Authentication');


//REDIS
require('./middleware/redisSetup')(app);

// DATABASE
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});

// Other settings
// app.set('public', path.join(__dirname, 'public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// app.use(userStats);

// AUTHENTICATION
require('./authentication/session')(app);
require('./authentication/passportSetup')(app);

// USE ROUTES
app.use(IndexRoutes);
app.use(AnalyticsRoutes);
app.use(Authentication);

// Server
app.listen(process.env.PORT || 3000, () => {
	logger.info(`Worker ${process.pid} has started at port ${process.env.PORT}`)
});