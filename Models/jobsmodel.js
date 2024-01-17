const mongoose = require('mongoose');



// schemas for jobs

const jobSchema = new mongoose.Schema({
    title: String,
    salary: Number,
    location: String,
    description: String,
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;