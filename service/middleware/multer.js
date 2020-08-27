// storage

const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype === 'application/pdf') {
			cb(null, './userFiles/readings')
		} else if (file.mimetype.includes('image')) {
			cb(null, './public/images/course')
		} else {
			cb(null, './userFiles/presets')
		}
	},
	filename: function(req, file, cb){
		cb(null, req.body.name + '.' + file.originalname.split('.')[1]);
	}
});

module.exports = multer({storage: storage});