const errors = require('../business/errors/Errors'),
	logger = require('../business/logger/logger'),
	Course = require('../models/Course'),
	VideoCourse = require('../models/VideoCourse'),
	FileCourse = require('../models/File'),
	randomstring = require('randomstring'),
	fileManager = require('../business/service/fileManager');

module.exports.deleteExample = (req, res, next) => {
	const id = req.params.id;
	const index = req.params.index;
	Course.findById(id, (err, course) => {
		if(err) return next(err);
		if(!course) return next(new errors.ResourceNotFoundError(id));

		try{
			fileManager.removeFile(course.examples[index])
		}
		catch{
			logger.warn(`Could not remove example #${course.examples[index]} for course ${course.name}`)
		}

		course.examples.splice(index, 1);
		course.markModified('examples');
		course.save();

		logger.info(`Example for course ${course.name} was removed`);
		res.msg = "Example was successfully removed";
		next()
	})
};

module.exports.postExamples = (req, res, next) => {
	const id = req.params.id;

	Course.findById(id, async (err, course) => {
		if(err) return next(err);
		if(!course) return next(new errors.ResourceNotFoundError(id));
		if(!req.files || (req.files && req.files.length === 0)) return next(new errors.IncompleteReqDataError({"resource": 'files'}));

		const files = req.files;
		for(let filename in files){
			const file = files[filename];
			const name = randomstring.generate(7);
			const path = await fileManager.saveFile(file, "example", name);
			course.examples.push(path)
		}

		course.markModified('examples');
		course.save();

		logger.info(`Examples were successfully saved for course ${course.name}`);
		res.msg = "Examples were successfully saved";
		next()
	})
};