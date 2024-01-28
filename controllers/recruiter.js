require('dotenv').config();
const Recruiter = require('../Models/recruitermodel');
const Job = require('../Models/jobsmodel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cons = require('../constants');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const initializePassport = require('../passport-config');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '..', 'uploads');
        cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null,  uniqueSuffix + '-' + file.originalname);
    }
});


  
const upload = multer({ storage: storage })

initializePassport(passport, getuserbyemail, getuserbyid);

function ifError(err, req, res, next){
    console.error(err);
    res.status(cons.internalServerError).send('Internal Server Error');
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
            username: req.body?.username,
            email: req.body?.email,
            password: await bcrypt.hash(req.body?.password, 10),
            company: req.body?.company
        });

        await recruiter.save();
        res.status(cons.ok).redirect('/recruiters/login');
    } catch (err) {
        if (err.code === cons.mongoerror) {
            req.flash('error', cons.userexists);
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

async function recruiterPostaJob(req, res, next) {
    try {
        const user = req.user;
        if (!req.file) {
            req.flash('error', 'Please upload a file');
            return res.render('postjob', { user, messages: req.flash() });
        }
        const job = new Job({
            title: req.body?.title,
            salary: req.body?.salary,
            location: req.body?.location,
            company: req.body?.company,
            description: req.body?.description,
            recruiter: user?._id,
            candidates: [],
            file: req.file?.filename 
        });
        await job.save();
        return res.redirect('/recruiters/home');
    } catch (err) {
        next(err);
    }
}



async function recruiterMyJobs(req,res){
    try{
        const user = req.user;
        const jobs = await Job.find({recruiter: user?._id});
        return res.render('recruiterhome',{user, jobs, messages: req.flash()});
    }
    catch(err){
        next(err);
    }
}

async function recruiterDeleteJob(req,res){
    try{
        const id = req.params?.id;
        const job = await Job.findById(id);
        const filePath = path.join(__dirname, '..', 'uploads', job?.file);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
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

async function getFile(req, res) {
    const directory = path.join(__dirname, '..', 'uploads'); 
    const filePath = path.join(directory, req.params?.file);
    res.sendFile(filePath);
}


async function viewFile(req,res){
    res.render('pdf-viewer', { file: req.params?.file });
};





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
    upload,
    getFile,
    viewFile
}