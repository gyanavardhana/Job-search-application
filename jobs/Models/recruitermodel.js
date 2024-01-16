const mongoose = require('mongoose');


// schemas for recruiters 

const recruiterSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    contact: Number,
    company: String,
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;