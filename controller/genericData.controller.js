const errors = require('../business/errors/Errors');

module.exports.getDataNames = (req, res, next, DataClass) => {
	DataClass.find({}, 'name', (err, object) => {
		if(err) next(err);
		res.msg = `'${DataClass.collection.collectionName}' were successfully retrieved`;
		res.data = object;
		next();
	});
};

module.exports.getDataObjectByName = (req, res, DataClass) => {
	DataClass.findOne({name: req.params.name}, (err, object) => {
		if(err) next(err);
		if(object){
			res.msg = `'${DataClass.collection.collectionName}' with name '${object.name}' was successfully retrieved`;
			res.data = object;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getDataObjectByID = (req, res, DataClass) => {
	DataClass.findById(req.params.id, (err, object) => {
		if(err) next(err);
		if(object){
			res.msg = `'${DataClass.collection.collectionName}' with name '${object.name}' was successfully retrieved`;
			res.data = object;
			next();
		}
		else next(new errors.ResourceNotFoundError(req.params.name))
	})
};

module.exports.getAllOfKind = (req, res, next, DataClass) => {
	DataClass.find({}, (err, object) => {
		if(err) next(err);
		res.msg = `'${DataClass.collection.collectionName}' were successfully retrieved`;
		res.data = object;
		next();
	});
};

module.exports.createOrUpdateDataObject = (req, res, next, DataClass) => {
	let data = req.data;
	let files = req.files;

	if (data._id) {
		// Modify existing instance
		DataClass.findByIdAndUpdate(data._id, data, async (err, dbObject) => {
			if (err) return next(err);
			if (!dbObject) return next(new errors.ResourceNotFoundError(data._id));

			// If req.files => we !should have 1 or 2 files. If 1 => image. If 2 => image and file
			if (files && files.constructor.name === 'Array' && files.length == 1) {
				files = parseFiles();
				dbObject.image = await fileManager.saveFile(
					files.image,
					DataClass.collection.collectionName + '-image',
					dbObject._id
				);
				dbObject.file = await fileManager.saveFile(
					files.file,
					DataClass.collection.collectionName + '-file',
					dbObject._id
				);
				dbObject.save();
			} else if (files && files.constructor.name === 'Array' && files.length == 2) {
				dbObject.image = await fileManager.saveFile(
					files.image,
					DataClass.collection.collectionName + '-image',
					dbObject._id
				);
				dbObject.save();
			}

			logger.info(`${DataClass.collection.collectionName} '${dbObject.name}' was successfully updated`);

			res.msg = `${DataClass.collection.collectionName} '${dbObject.name}' was successfully updated`;
			next();
		})
	} else {
		// create new instance
		DataClass.create(data, async (err, material) => {
			if (err) return next(err);
			if (!material) return next(new Error('Server failed to create Material'));

			files = parseFiles();
			material.image = await fileManager.saveFile(
				files.image,
				DataClass.collection.collectionName + '-image',
				material._id
			);
			material.file = await fileManager.saveFile(
				files.file,
				DataClass.collection.collectionName + '-file',
				material._id
			);
			material.save();

			logger.info(`${DataClass.collection.collectionName} '${material.name}' was successfully created`);

			res.data = material;
			res.msg = `${DataClass.collection.collectionName} '${material.name}' was successfully created`;
			next();
		})
	}

	function parseFiles(){
		let newFiles = {};
		for(let i = 0; i < files.length; i++){
			if(files[i].originalName === 'image'){
				newFiles.image = files[i]
			} else if(files[i].originalName === 'file'){
				newFiles.file = files[i]
			} else {
				throw new errors.IncompleteDataError({maneMismatch: files[i].originalName})
			}
		}
		return newFiles
	}
};