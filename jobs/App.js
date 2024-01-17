const express = require('express');
const db = require('./db/databaseconnection');
const app = express();
const port = 3000;


const recruiterroutes = require('./routes/recruiterauth');
// database connection

app.set('view engine', 'ejs');

const Job = require('./Models/jobsmodel');
const Candidate = require('./Models/candidatemodel');
app.use(recruiterroutes);

// all routes



app.listen(port, () => console.log(`Example app listening on port ${port}!`));