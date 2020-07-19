module.exports.isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		next();
	} else {
		res.status(401).json({msg: 'You are now authhorized to view this page'})
	}
};

module.exports.isAdmin = (req, res, next) => {
	if(req.isAuthenticated() && req.user.admin){
		next();
	} else {
		res.status(401).json({msg: 'You are now authhorized to view this page'})
	}
};