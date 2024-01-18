
const Recruiter = require('../Models/recruitermodel');
const bcrypt = require('bcrypt');
const datadictionary = require('../exports');






function recruiterSignupPage(req,res){
    return res.render('signup',{messages: req.flash()});
}

function recruiterLoginPage(req,res){
    return res.render('login',{messages: req.flash()});
}

function recruiterProfilePage(req,res){
    return res.render('profile',{messages: req.flash()});
}


async function recruitersignup(req, res) {
    const recruiter = new Recruiter(
        {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            company: req.body.company
        }
    )
    await recruiter.save()
        .then((result) => {
            res.status(datadictionary.ok).redirect('/recruiters/login');
        })
        .catch((err) => {
            console.log(err);
        })
}


async function recruiterlogout(req, res) {

    req.logOut((err) => {
        console.log(err);
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
    recruiterSignupPage,
    recruiterLoginPage,
    recruiterProfilePage,
    recruitersignup,
    recruiterlogout,
    getuserbyemail,
    getuserbyid,
    checkAuthenticated,
    checkNotAuthenticated,
}