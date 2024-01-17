const mongoose = require('mongoose');

// schemas for candidates

const candidateSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    education: String,
    appliedjobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
});


const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;