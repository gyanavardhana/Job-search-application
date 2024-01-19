const Recruiter = require('../Models/recruitermodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const datadictionary = require('../exports');
const passport = require('passport');
const initializePassport = require('../passport-config');


initializePassport(passport, getuserbyemail, getuserbyid);

function ifError(err, req, res, next){
    console.error(err);
    res.status(datadictionary.internalServerError).send('Internal Server Error');
}

function recruiterSignupPage(req,res){
    return res.render('signup',{messages: req.flash()});
}

function recruiterLoginPage(req,res){
    return res.render('login',{messages: req.flash()});
}

function recruiterProfilePage(req,res){
    try {
        const user = req.user;
        return res.render('profile', { user, messages: req.flash() });
    } catch (err) {
        next(err);
    }
}




async function recruitersignup(req, res) {
    try {
        const recruiter = new Recruiter({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            company: req.body.company
        });

        await recruiter.save();
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

async function recruiterlogin(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/recruiters/profile',
        failureRedirect: '/recruiters/login',
        failureFlash: true
    })(req, res, next);
}

function recruiterHomePage(req,res){
    try {
        const user = req.user;
        return res.render('recruiterhome', { user, messages: req.flash() });
    } catch (err) {
        next(err);
    }
}

function recruiterPostPage(req,res){
    try{
        const user = req.user;
        return res.render('postjob',{user, messages: req.flash()});
    }
    catch(err){
        next(err);
    }
}

async function recruiterPostaJob(req,res){
    try{
        const user = req.user;
        const job = new Job({
            title: req.body.title,
            salary: req.body.salary,
            location: req.body.location,
            company: req.body.company,
            description: req.body.description,
            recruiter: user._id,
            candidates: []
        });
        await job.save();
        return res.redirect('/recruiters/home');
    }
    catch(err){
        next(err);
    }
}


async function recruiterMyJobs(req,res){
    try{
        const user = req.user;
        const jobs = await Job.find({recruiter: user._id});
        return res.render('recruiterhome',{user, jobs, messages: req.flash()});
    }
    catch(err){
        next(err);
    }
}

async function recruiterDeleteJob(req,res){
    try{
        const id = req.params.id;
        await Job.findByIdAndDelete(id);
        return res.redirect('/recruiters/home');
    }
    catch(err){
        next(err);
    }
}

async function recruiterlogout(req, res) {

    req.logOut((err) => {
        if(err){
            console.log(err);
        }
    });
    res.redirect('/recruiters/login');

}

async function getuserbyemail(email) {
    try {
        const user = await Recruiter.findOne({ email: email });
        return user;
    } catch (err) {
        console.log(err);
    }
}

async function getuserbyid(id) {
    try {
        const user = await Recruiter.findById(id);
        return user;
    } catch (err) {
        console.log(err);
    }
}


async function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/recruiters/login');
}


async function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/recruiters/profile');
    }
    next();
}



module.exports = {
    ifError,
    recruiterSignupPage,
    recruiterLoginPage,
    recruiterProfilePage,
    recruitersignup,
    recruiterlogin,
    recruiterHomePage,
    recruiterPostPage,
    recruiterPostaJob,
    recruiterMyJobs,
    recruiterDeleteJob,
    recruiterlogout,
    getuserbyemail,
    getuserbyid,
    checkAuthenticated,
    checkNotAuthenticated,
}