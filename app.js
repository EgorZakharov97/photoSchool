require('dotenv').config();

const express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	ejs = require('ejs');

// APP
const app = express();

// COOKIES
app.use(cookieParser());

// REQUIRED FUNCTIONS
const logger = require('./service/logger/logger');
const userStats = require('./service/middleware/userStats');

// VIEW ENGINE
app.set('views', path.join(__dirname, 'Public'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// ROUTES
const IndexRoutes = require('./routes/index.routes');
const Authentication = require('./routes/auth.routes');
const MemberPortalRoutes = require('./routes/portal.routes');


//REDIS
require('./service/middleware/redisSetup')(app);

// DATABASE
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});

// Other settings
// app.set('public', path.join(__dirname, 'public'));
app.set('views', __dirname + '/views');
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// app.use(userStats);

// AUTHENTICATION
require('./service/authentication/session')(app);
require('./service/authentication/passportSetup')(app);

// USE ROUTES
app.use(IndexRoutes);
app.use('/auth', Authentication);
app.use('/portal', MemberPortalRoutes);

// Server
app.listen(process.env.PORT || 3000, () => {
	logger.info(`Worker ${process.pid} has started at port ${process.env.PORT}`)
});