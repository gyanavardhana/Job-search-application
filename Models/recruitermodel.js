const mongoose = require('mongoose');


// schemas for recruiters 

const recruiterSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    contact: Number,
    company: String,
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;