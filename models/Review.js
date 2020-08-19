const mongoose = require('mongoose');

ReviewSchema = new mongoose.Schema({
    email: String,
    portal: String,
    workshop: String,
    webex: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", ReviewSchema);