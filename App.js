require('dotenv').config();
const path = require('path');
const express = require('express');
const db = require('./db/databaseconnection');
const app = express();
const port = process.env.PORT;
const recruiterroutes = require('./routes/recruiterauth');
const candidateroutes = require('./routes/candidateauth');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(recruiterroutes);
app.use(candidateroutes);


module.exports = app;

app.listen(port, () => console.log(`app listening on port ${port}!`));