require('dotenv').config();

const express = require('express'),
	partials = require('express-partials'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	ejs = require('ejs'),
	http = require('http'),
	https = require('https');

const { Certificate } = require('crypto');

// APP
const app = express();

// REQUIRED FUNCTIONS
const logger = require('./service/logger/logger');
const userStats = require('./service/middleware/userStats');

// App settings
app.set('views', path.join(__dirname, 'Public'));
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');

// MIDDLEWARE
app.engine('html', ejs.renderFile);
app.use(partials());
app.use(cookieParser());
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// DATABASE
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

// AUTHENTICATION
require('./service/authentication/session')(app);
require('./service/authentication/passportSetup')(app);

// ROUTES
const IndexRoutes = require('./routes/index.routes');
const Authentication = require('./routes/auth.routes');
const MemberPortalRoutes = require('./routes/portal.routes');
const PaymentRoutes = require('./routes/payment.routes');
const AdminRoutes = require('./routes/admin.routes');
const FilesRoutes = require('./routes/files.routes');

// USE ROUTES
app.use(IndexRoutes);
app.use('/auth', Authentication);
app.use('/portal', MemberPortalRoutes);
app.use('/buy', PaymentRoutes);
app.use('/admin', AdminRoutes);
app.use('/file', FilesRoutes);


if(process.env.NODE_ENV === 'development'){
	// Server
	app.listen(process.env.PORT || 3000, () => {
		logger.info(`App ${process.pid} has started at port ${process.env.PORT}`)
	});
} else {
	https.createServer(credentials, app).listen(80, () => {
		console.log('App is listening on port 80')
	});
	http.createServer((req, res) => {
		res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
		res.end();
	}).listen(80)
}

