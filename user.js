require('dotenv').config();
const User = require('./models/User'),
	mongoose = require('mongoose');

// DATABASE
if(process.env.NODE_ENV === 'development'){
	mongoose.connect(process.env.DB_CONNECT_DEV, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} else {
	mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}

User.find({}, (err, users) => {
	err ? console.log(err) : false;
	console.log("User count: " + users.length);
	users.filter((user, i) => {
		let count = user.courses.length;
		console.log(`${user.username} has ${count} courses`);
		user.discount.discountCount = count;
		user.save();
		console.log(i+1)
	})
});