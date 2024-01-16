const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = 3000;


const recroutes = require('./routes/recruiterauth');
// database connection
const db = require('./db/databaseconnection');
app.set('view engine', 'ejs');





const Job = require('./Models/jobsmodel');
const Candidate = require('./Models/candidatemodel');

app.use(recroutes);
// all routes



app.listen(port, () => console.log(`Example app listening on port ${port}!`));