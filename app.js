require('dotenv').config();

const express = require('express'),
	responseHandler = require('./business/middleware/responseHandler').responseHandler,
	errorHandler = require('./business/middleware/responseHandler').errorHandler,
	partials = require('express-partials'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	path = require('path'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	ejs = require('ejs'),
	http = require('http'),
	https = require('https'),
	fs = require('fs'),
	sanitize = require('sanitize'),
	cors = require('cors');

const { Certificate } = require('crypto');

// APP
const app = express();

// REQUIRED FUNCTIONS
const logger = require('./business/logger/logger');
const userStats = require('./business/middleware/userStats');

// App settings
app.set('views', path.join(__dirname, 'Public'));
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');

// MIDDLEWARE
app.engine('html', ejs.renderFile);
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));
app.use(partials());
app.use(cookieParser());
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));
app.use('*/videos',express.static('public/videos'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitize.middleware);

// DATABASE
if(process.env.NODE_ENV === 'development'){
	mongoose.connect(process.env.DB_CONNECT_DEV, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} else {
	mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}
mongoose.set('useFindAndModify', true);

// AUTHENTICATION
require('./business/authentication/session')(app);
require('./business/authentication/passportSetup')(app);

// ROUTES
const PublicDataRoutes = require('./routes/data.public.routes');
const ProtectedDataRoutes = require('./routes/data.protected.routes');
// const Authentication = require('./routes/auth.routes');
// const MemberPortalRoutes = require('./routes/portal.routes');
// const PaymentRoutes = require('./routes/payment.routes');
const AdminRoutes = require('./routes/admin.routes');
// const FilesRoutes = require('./routes/files.routes');
// const TestRoutes = require('./routes/test');

// USE ROUTES
app.use('/api/v1', PublicDataRoutes);
app.use('/api/v1', ProtectedDataRoutes);
// app.use('/auth', Authentication);
// app.use('/portal', MemberPortalRoutes);
// app.use('/buy', PaymentRoutes);
app.use('/api/v1/admin', AdminRoutes);
// app.use('/file', FilesRoutes);
// app.use(TestRoutes);


app.use('/api/v1', responseHandler);
app.use(errorHandler);

if(process.env.NODE_ENV === 'development'){
	// Server
	app.listen(process.env.PORT || 3000, () => {
		logger.info(`App ${process.pid} has started at port ${process.env.PORT}`)
	});
} else {
	const pricateKey = fs.readFileSync(process.env.PATH_APP_PK, 'utf8');
	const ca = fs.readFileSync(process.env.PATH_APP_CA, 'utf8');
	const certificate = fs.readFileSync(process.env.PATH_APP_CERT, 'utf8');
	const credentials = {
		key: pricateKey,
		cert: certificate,
		ca: ca
	};

	https.createServer(credentials, app).listen(process.env.SSL_PORT, () => {
		console.log(`App is listening on port ${process.env.SSL_PORT}`)
	});
	http.createServer((req, res) => {
		res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
		res.end();
	}).listen(process.env.PORT)
}