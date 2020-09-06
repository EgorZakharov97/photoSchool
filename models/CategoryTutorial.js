const mongoose = require('mongoose');

CategoryTutorialSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	tutorials: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Tutorial"
		}
	]
});

module.exports = mongoose.model("CategoryTutorial", CategoryTutorialSchema);