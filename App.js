const express = require('express');
const db = require('./db/databaseconnection');
const app = express();
const port = 3000;


const recruiterroutes = require('./routes/recruiterauth');
const candidateroutes = require('./routes/candidateauth');

app.set('view engine', 'ejs');

app.use(recruiterroutes);
app.use(candidateroutes);
app.use(express.static('public'));

app.get('/pdf/:file', (req, res) => {
	res.sendFile(`${__dirname}/public/${req.params.file}`);
});

app.get('/pdf/:file', (req, res) => {
	res.render('pdf-viewer', { file: req.params.file });
});
// all routes



app.listen(port, () => console.log(`Example app listening on port ${port}!`));