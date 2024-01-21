const mongoose = require('mongoose');

// schemas for candidates

const candidateSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    contact: Number,
    organization: String,
    appliedjobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
});


const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;  