const Candidate = require('../Models/candidatemodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const datadictionary = require('../exports');


async function candidateProfile(req, res) {
    const user = await Candidate.findById(req.user.id);
    return res.render('candidateprofile', { user: user });
}


async function candidateSignup(req, res) {
    try {
        const candidate = new Candidate({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            contact: req.body.contact,
            organization: req.body.organization
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

async function createToken(id) {
    const token = jwt.sign({ id }, 'sahfhasfhakshfkdhfa', { expiresIn: 1000 });
    return token;
}

async function checkAuthenticated(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/recruiters/login');
    }
    try {
        const user1 = jwt.verify(token, 'sahfhasfhakshfkdhfa');
        req.user = user1;
        next();
    } catch (error) {
        res.redirect('/recruiters/login');
    }
}

async function checkNotAuthenticated(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const user1 = jwt.verify(token, 'sahfhasfhakshfkdhfa');
            req.user = user1;
            return res.redirect('/candidates/profile');
        } catch (error) {
            next();
        }
    } else {
        next();
    }

}

async function candidateLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    try {
        const user = await Candidate.findOne({ email: email });
        console.log(user);
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = await createToken(user._id);
                res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 * 24 * 3 });
                res.status(datadictionary.ok).redirect('/candidates/profile');
            } else {
                req.flash('error', datadictionary.invalidlogin);
                res.redirect('/recruiters/login');
            }
        } else {
            req.flash('error', datadictionary.nouser);
            res.redirect('/recruiters/signup');
        }
    } catch (err) {
        next(err);
    }
}

async function candidateLogout(req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.redirect('/recruiters/login');
}


async function candidateApplyPage(req, res) {

    const jobs = await Job.find();
    res.render('candidatejobs', { jobs: jobs , messages: req.flash()});
}

async function candidateApply(req, res, next) {
    try {
        const id = req.params.id;
        const job = await Job.findById(id);
        if (job.candidates.includes(req.user.id)) {
            req.flash('error', datadictionary.applieddone);
            const jobs = await Job.find();
            return res.render('candidatejobs', { jobs: jobs, messages: req.flash() });
        } else {
            const updateJob = await Job.findByIdAndUpdate(id, { $push: { candidates: req.user.id } });
            const updateUser = await Candidate.findByIdAndUpdate(req.user.id, { $push: { appliedjobs: id } });
            req.flash('success', datadictionary.applysuccess);
            const jobs = await Job.find();
            return res.render('candidatejobs', { jobs: jobs, messages: req.flash() });
        }
    } catch(err) {
        next(err);
    }
}

async function candidateWithDraw(req,res,next){
    try {
        const id = req.params.id;
        const job = await Job.findById(id);
        console.log(job.Date);
        if (job.candidates.includes(req.user.id)) {
            const updateJob = await Job.findByIdAndUpdate(id, { $pull: { candidates: req.user.id } });
            const updateUser = await Candidate.findByIdAndUpdate(req.user.id, { $pull: { appliedjobs: id } });
            req.flash('success', datadictionary.withdrawsuccess);
            const jobs = await Job.find();
            return res.render('candidatejobs', { jobs: jobs, messages: req.flash() });
        } else {
            req.flash('error', datadictionary.notapplied);
            const jobs = await Job.find();
            return res.render('candidatejobs', { jobs: jobs, messages: req.flash() });
        }
    } catch(err) {
        next(err);
    }
}


module.exports = {
    candidateSignup,
    candidateLogin,
    candidateProfile,
    checkAuthenticated,
    checkNotAuthenticated,
    candidateLogout,
    candidateApplyPage,
    candidateApply,
    candidateWithDraw
}