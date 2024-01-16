const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const Router = express.Router();

const Recruiter = require('../Models/recruitermodel');


Router.use(express.json());
Router.use(express.urlencoded({ extended: false }));
Router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
Router.use(flash());


Router.get('/recruiters/profile',(req,res)=>{
    res.render('profile', {messages: req.flash()});
})

Router.get('/recruiters/login',(req,res)=>{
    res.render('login', {messages: req.flash()});
})

Router.get('/recruiters/signup',(req,res)=>{
    res.render('signup');
});

Router.post('/recruiters/signup', async(req,res)=>{
    const recruiter = new Recruiter(req.body);
    await recruiter.save()
    .then((result)=>{
        res.redirect('/recruiters/login');
    })
    .catch((err)=>{
        console.log(err);
    })
})

Router.post('/recruiters/login', async (req, res) => {
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

module.exports = Router;