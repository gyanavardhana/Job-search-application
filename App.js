const express = require('express');
const db = require('./db/databaseconnection');
const app = express();
const port = 3000;


const recruiterroutes = require('./routes/recruiterauth');
const candidateroutes = require('./routes/candidateauth');

app.set('view engine', 'ejs');

app.use(recruiterroutes);
app.use(candidateroutes);


    

// all routes



app.listen(port, () => console.log(`Example app listening on port ${port}!`));