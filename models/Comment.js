const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	author: {
        id: String,
        name: String,
        img: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Course",
        required: true
    },
    datePosted: {
        required: true,
        type: Date
    },
    subcomments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
        }
    ],
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Comment", CommentSchema);