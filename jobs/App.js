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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

const Job = require('./Models/jobsmodel');
const Recruiter = require('./Models/recruitermodel');
const Candidate = require('./Models/candidatemodel');

// all routes

app.get('/recruiters/profile',(req,res)=>{
    res.render('profile', {messages: req.flash()});
})

app.get('/recruiters/login',(req,res)=>{
    res.render('login', {messages: req.flash()});
})

app.get('/recruiters/signup',(req,res)=>{
    res.render('signup');
});

app.post('/recruiters/signup', async(req,res)=>{
    const recruiter = new Recruiter(req.body);
    await recruiter.save()
    .then((result)=>{
        res.redirect('/recruiters/login');
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post('/recruiters/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await Recruiter.findOne({ email });
    if (user) {
        if (user.password === password) {
            req.flash('success', 'Login Successful');      
            res.status(200).redirect('/recruiters/profile' );
        } else {
            console.log('Invalid Credentials');
            req.flash('error', 'Invalid Credentials');
            res.status(401).redirect('/recruiters/login' );
        }
    } else {
        console.log('Invalid Credentials');
        req.flash('error', 'Invalid Credentials');
        res.status(401).redirect('/recruiters/login');
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));