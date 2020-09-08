const errors = require('../business/errors/Errors'),
	logger = require('../business/logger/logger'),
	fileManager = require('../business/service/fileManager');

module.exports.getDataNames = (req, res, next) => {
	const DataClass = req.DataClass;
	DataClass.find({}, 'name', (err, object) => {
		if(err) next(err);
		res.msg = `${DataClass.collection.collectionName} were successfully retrieved`;
		res.data = object;
		next();
	});
};

module.exports.getDataObjectByName = (req, res, next) => {
	const DataClass = req.DataClass;
	DataClass.findOne({name: req.params.name}, (err, object) => {
		if(err) next(err);
		if(object){
			res.msg = `${DataClass.collection.collectionName} with name '${object.name}' was successfully retrieved`;
			res.data = object;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getDataObjectByID = (req, res, next) => {
	const DataClass = req.DataClass;
	DataClass.findById(req.params.id, (err, object) => {
		if(err) next(err);
		if(object){
			res.msg = `${DataClass.collection.collectionName} with name '${object.name}' was successfully retrieved`;
			res.data = object;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getAllOfKind = (req, res, next) => {
	const DataClass = req.DataClass;
	DataClass.find({}, (err, object) => {
		if(err) next(err);
		res.msg = `${DataClass.collection.collectionName} were successfully retrieved`;
		res.data = object;
		next();
	});
};

module.exports.createOrUpdateDataObject = (req, res, next) => {
	let DataClass = req.DataClass;
	let data = req.body;
	let files = req.files;

	if (data._id) {
		// Modify existing instance
		DataClass.findByIdAndUpdate(data._id, data, async (err, dbObject) => {
			if (err) return next(err);
			if (!dbObject) return next(new errors.ResourceNotFoundError(data._id));

			manageFiles(dbObject);

			logger.info(`${DataClass.collection.collectionName} '${dbObject.name}' was successfully updated`);

			res.data = dbObject;
			res.msg = `${DataClass.collection.collectionName} '${dbObject.name}' was successfully updated`;
			next();
		})
	} else {
		// create new instance
		DataClass.create(data, async (err, bdObject) => {
			if (err) return next(err);
			if (!bdObject) return next(new Error('Server failed to create Material'));

			manageFiles(bdObject);

			logger.info(`${DataClass.collection.collectionName} '${bdObject.name}' was successfully created`);

			res.data = bdObject;
			res.msg = `${DataClass.collection.collectionName} '${bdObject.name}' was successfully created`;
			next();
		})
	}

	async function manageFiles(dbObject) {
		// If req.files => we !should have 1 or 2 files. If 1 => image. If 2 => image and file
		if (files && files.constructor.name === 'Array') {
			let parsedFiles = parseFiles();
			if(parsedFiles.image){
				dbObject.image = await fileManager.saveFile(
					parsedFiles.image,
					DataClass.collection.collectionName + '-image',
					dbObject._id
				);
			}
			if (parsedFiles.file){
				dbObject.file = await fileManager.saveFile(
					parsedFiles.file,
					DataClass.collection.collectionName + '-file',
					dbObject._id
				);
			}

			dbObject.save();
		}
	}

	function parseFiles(){
		let newFiles = {};
		for(let i = 0; i < files.length; i++){
			if(files[i].originalName === 'image'){
				newFiles.image = files[i]
			} else if(files[i].originalName === 'file'){
				newFiles.file = files[i]
			} else {
				throw new errors.IncompleteReqDataError({maneMismatch: files[i].originalName, shouldCall: ["image", "file"]})
			}
		}
		return newFiles
	}
};

module.exports.deleteObjectById = (req, res, next) => {
	const DataClass = req.DataClass;
	const id = req.params.id;
	DataClass.findByIdAndRemove(id, (err, coupon) => {
		if(err) return next(err);
		logger.info(`${DataClass.collection.collectionName} '${coupon.name}' was successfully removed`);
		res.msg = `${DataClass.collection.collectionName} '${coupon.name}' was successfully removed`;
		next();
	})
};

module.exports.findObject = (req, res, next) => {
	const DataClass = req.DataClass;
	const query = req.query;
	DataClass.find(query, (err, dbArray) => {
		if(err) next(err);
		res.data = dbArray;
		res.message = `(${DataClass.collection.collectionName}) were successfully retrieved`;
		next()
	})
};

module.exports.removeObjectFilesById = function(req, res, next) {
	const DataClass = req.DataClass;
	DataClass.findById(req.params.id, (err, dbObject) => {
		if(err) return next(err);
		if(!dbObject) return next(new errors.ResourceNotFoundError(req.params.id));

		try{
			if(dbObject.file) fileManager.removeFile(dbObject.file);
			if (dbObject.image) fileManager.removeFile(dbObject.image);
		}
		catch (e) {
			logger.warn(`${dbObject.name} with id ${dbObject._id} was removed without files cleanup. Probably this object did not have any files.`)
		}

		if(dbObject.examples){
			const examples = dbObject.examples;
			for(let example of examples){
				try{
					fileManager.removeFile(example)
				}
				catch (e) {
					logger.warn(`Example image was skipped while debiting files for ${DataClass.collection.collectionName} '${dbObject.name}'`)
				}
			}
		}

		next()
	})
};