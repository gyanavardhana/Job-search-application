const Candidate = require('../Models/candidatemodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const datadictionary = require('../exports');
const passport = require('passport');
const initializePassport = require('../passport-config');

initializePassport(passport, getuserbyemail, getuserbyid, 'candidate');

function candidateHomePage(req,res){
    try{
        const user = req.user;
        return res.render('candidatehome',{user, messages: req.flash()});
    }catch(err){
        next(err);
    }
}

async function candidateSignup(req,res){
    try {
        const candidate = new Candidate({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            contact: req.body.contact,
            organization: req.body.organization,
            appliedjobs: []
        });

        await candidate.save();
        res.status(datadictionary.ok).redirect('/recruiters/login');
    } catch (err) {
        if (err.code === datadictionary.mongoerror) {
            req.flash('error', datadictionary.userexists);
            res.render('signup', { messages: req.flash() });
        } else {
            next(err);
        }
    }
}


async function candidateLogin(req,res,next){
    passport.authenticate('local', {
        successRedirect: '/candidates/profile',
        failureRedirect: '/recruiters/login',
        failureFlash: true
    })(req, res, next);
}


async function getuserbyemail(email) {
    try {
        console.log('hiiii')
        const user = await Candidate.findOne({ email: email });
        return user;
    } catch (err) {
        console.log(err);
    }
}

async function getuserbyid(id) {
    try {
        console.log(hi);
        const user = await Candidate.findById(id);
        return user;
    } catch (err) {
        console.log(err);
    }
}


async function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/candidates/login');
}


async function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/candidates/profile');
    }
    next();
}

module.exports = {
    candidateSignup,
    candidateLogin,
    candidateHomePage,
    checkAuthenticated,
    checkNotAuthenticated
}