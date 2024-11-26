const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    user1: { type: String, required: true,unique:true }, 
    user2: { type: String, required: true,unique:true }, 
    startedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' },
    endedAt: { type: Date },
});

const Match = mongoose.model('Match',matchSchema);

module.exports = Match;