module.exports.ResourceNotFoundError = class ResourceNotFoundError extends Error {
	constructor(resource) {
		super();
		this.message = `Resource ${resource} was not found`;
		this.name = this.constructor.name;
		this.data = resource;
		this.statusCode = 200;
		Error.captureStackTrace(this, this.constructor);
	}
};

module.exports.ProductAvailabilityError = class ProductAvailabilityError extends Error {
	constructor(msg) {
		super();
		this.message = msg;
		this.name = this.constructor.name;
		this.statusCode = 200;
		Error.captureStackTrace(this, this.constructor);
	}
};

module.exports.IncompatibleCouponError = class IncompatibleCouponError extends Error {
	constructor(coupon, product) {
		super();
		coupon && product ?
			this.message = `Coupon ${coupon.code} is for ${coupon.product} and cannot be used with ${product}`
			:
			this.message = 'The coupon provided cannot be used with this product';
		this.statusCode = 200;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
};

module.exports.SubscriptionGrantError = class SubscriptionGrantError extends Error {
	constructor(msg) {
		super();
		this.message = msg;
		this.name = this.constructor.name;
		this.statusCode = 200;
		Error.captureStackTrace(this, this.constructor);
	}
};

module.exports.IncompleteReqDataError = class IncompleteDataError extends Error {
	constructor(data) {
		super();
		this.message = "Data is incomplete";
		this.data = data;
		this.name = this.constructor.name;
		this.statusCode = 200;
		Error.captureStackTrace(this, this.constructor);
	}
};

module.exports.RuntimeError = class RuntimeError extends Error {
	constructor(msg, data={}) {
		super();
		this.message = msg;
		this.data = data;
		this.name = this.constructor.name;
		this.statusCode = 200;
		Error.captureStackTrace(this, this.constructor);
	}
};