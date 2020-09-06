const session = require('express-session'),
	redis = require('redis'),
	redisClient = redis.createClient(),
	redisStore = require('connect-redis')(session),
	mongoose = require('mongoose'),
	util = require('util'),
	logger = require('../logger/logger');

module.exports = (app) => {
	redisClient.on('error', (err) => {
		logger.error("Redis error:\n" + err);
	});

	// set up redis to work with database
	redisClient.hget = util.promisify(redisClient.hget);

	const exec = mongoose.Query.prototype.exec;

	mongoose.Query.prototype.cache = function(options = {expire: 60}) {
		this.useCache = true;
		this.expire = options.expire;
		this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

		return this;
	};

	mongoose.Query.prototype.exec = async function() {
		if(!this.useCache){
			return await exec.apply(this, arguments);
		}

		const key = JSON.stringify({
			...this.getQuery(),
			collection: this.mongooseCollection.name
		});

		// get cached value for redis
		const cacheValue = await redisClient.hget(this.hashKey, key);

		if(!cacheValue) {
			const result = await exec.apply(this, arguments);
			redisClient.hset(this.hashKey, key, JSON.stringify(result));
			redisClient.expire(this.hashKey, this.expire);

			console.log('Result data from MongoDB');
			return result;
		}

		const doc = JSON.parse(cacheValue);
		console.log('Return data from Redis');
		return Array.isArray(doc)
			? doc.map(d => new this.model(d))
			: new this.model(doc);
	};

	module.exports = {
		clearHash(hashKey) {
			client.del(JSON.stringify(hashKey));
		}
	}
};