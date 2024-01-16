const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = 3000;

// database connection
app.set('view engine', 'ejs');

try {
    mongoose.connect('mongodb://127.0.0.1:27017/jobportal', {})
        .then(() => console.log("Database Connected"));
}
catch (err) {
    console.log(err);
}


const recroutes = require('./routes/recruiterauth');

const Job = require('./Models/jobsmodel');
const Candidate = require('./Models/candidatemodel');

app.use(recroutes);
// all routes



app.listen(port, () => console.log(`Example app listening on port ${port}!`));