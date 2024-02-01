require('dotenv').config();
const express = require('express');
const db = require('./db/databaseconnection');
const app = express();
const port = process.env.PORT

const recruiterroutes = require('./routes/recruiterauth');
const candidateroutes = require('./routes/candidateauth');

app.set('view engine', 'ejs');

app.use(recruiterroutes);
app.use(candidateroutes);



app.get('/src/output.css', (req, res) => {
    res.sendFile(__dirname + '/src/output.css');
});
// all routes



app.listen(port, () => console.log(`app listening on port ${port}!`));