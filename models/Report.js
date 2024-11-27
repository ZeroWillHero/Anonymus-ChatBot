const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedBy: { type: String, required: true }, // Telegram ID
    reportedUser: { type: String, required: true }, // Telegram ID
    reason: { type: String, required: true }
},{
    timestamps : true
});

const Report = mongoose.model('Report',reportSchema);

module.exports = Report;