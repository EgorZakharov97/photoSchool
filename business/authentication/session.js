const session = require('express-session'),
	redis = require('redis'),
	MemoryStore = require('memorystore')(session);
	// redisClient = redis.createClient(),
	// redisStore = require('connect-redis')(session);

module.exports = (app) => {
	// Set up the session so that it is saved in redis
	app.use(session ({
		secret: process.env.SESSION_SECRET,
		name: '_photolite.academy',
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false},
		store: new MemoryStore({checkPeriod: 86400000})
		// store: new redisStore({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient, ttl: 8640})
	}));
};