const fs = require('fs'),
	{promisify} = require('util'),
	pipeline = promisify(require('stream').pipeline);

function getPath(type) {
	switch(type){
		case 'workshops':
			return `./public/images/workshops/`;

		case 'tutorials':
			return `./public/images/tutorials/`;

		case 'materials-image':
			return `./public/images/materials/`;

		case 'materials-file':
			return './portalFiles/materials/';

		case 'presets-image':
			return `./public/images/presets/`;

		case 'presets-file':
			return './portalFiles/presets/';

		case 'challenges':
			return './public/images/challenges/';

		case 'examplecourses':
			return './portalFiles/examples-course/';

		case 'filecourses-file':
			return './portalFiles/files-course/';

		default:
			return `./bin/`;
	}
}

module.exports.saveFile = async function(file, type, name) {
	let path = getPath(type);
	path += name + file.detectedFileExtension;
	await pipeline(file.stream, fs.createWriteStream(path));
	return path;
};

module.exports.removeFile = function(path) {
	try{
		fs.unlinkSync( __dirname + path);
	}
	catch(e){
		throw e
	}
};