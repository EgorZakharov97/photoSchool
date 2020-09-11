module.exports.isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		if(req.user.verification.verified){
			if(!req.user.complete){
				res.redirect('/auth/update');
			} else {
				next();
			}
		} else {
			res.redirect('/auth/local/confirm')
		}
	} else {
		res.redirect('/auth')
	}
};

module.exports.isAdmin = (req, res, next) => {
	console.log(req.user)
	if(req.isAuthenticated() && req.user.admin){
		next();
	} else {
		res.redirect('/auth')
	}
};

module.exports.doesExist = (req, res, next) => {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/auth')
	}
};