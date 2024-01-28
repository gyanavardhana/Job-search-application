require('dotenv').config();
const Candidate = require('../Models/candidatemodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cons = require('../constants');


async function candidateProfile(req, res) {
    const user = await Candidate.findById(req.user?.id);
    return res.render('candidateprofile', { user: user });
}


async function candidateSignup(req, res) {
    try {
        const candidate = new Candidate({
            username: req.body?.username,
            email: req.body?.email,
            password: await bcrypt.hash(req.body?.password, 10),
            contact: req.body?.contact,
            organization: req.body?.organization
        });
        await candidate.save();
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

async function createToken(id) {
    const token = jwt.sign({ id }, process.env.JWT_KEY , { expiresIn: 1000 });
    return token;
}

async function checkAuthenticated(req, res, next) {
    const token = req.cookies?.jwt;
    if (!token) {
        return res.redirect('/recruiters/login');
    }
    try {
        const user1 = jwt.verify(token, process.env.JWT_KEY);
        req.user = user1;
        next();
    } catch (error) {
        res.redirect('/recruiters/login');
    }
}

async function checkNotAuthenticated(req, res, next) {
    const token = req.cookies?.jwt;
    if (token) {
        try {
            const user1 = jwt.verify(token, process.env.JWT_KEY);
            req.user = user1;
            return res.redirect('/candidates/profile');
        } catch (error) {
            next();
        }
    } else {
        next();
    }

}

async function comparePassword(password, user) {
    const auth = await bcrypt.compare(password, user?.password);
    return auth;
}

async function candidateLogin(req, res, next) {
    const email = req.body?.email;
    const password = req.body?.password;
    expirydate  = 1000 * 60 * 60 * 24 * 3
    try {
        const user = await Candidate.findOne({ email: email });
        if (user) {
            const auth = await comparePassword(password, user);
            if (auth) {
                const token = await createToken(user?._id);
                res.cookie('jwt', token, { maxAge: expirydate });
                res.status(cons.ok).redirect('/candidates/profile');
            } else {
                req.flash('error', cons.invalidlogin);
                res.redirect('/recruiters/login');
            }
        } else {
            req.flash('error', cons.nouser);
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

async function candidateAppliedJobsPage(req, res) {
    try {
        const jobs = await Job.find({ candidates: { $in: [req.user?.id] } });
        res.render('AppliedJobs', { jobs: jobs });
    } catch (err){
        next(err);
    }
}

async function candidateApplyPage(req, res) {

    const jobs = await Job.find();
    res.render('candidatejobs', { jobs: jobs , messages: req.flash()});
}


const jobAlreadyApplied = (job,user) => job.candidates.includes(user?.id);

async function applyForJob(jobId, userId) {
    const updateJob = await Job.findByIdAndUpdate(jobId, { $push: { candidates: userId } });
    const updateUser = await Candidate.findByIdAndUpdate(userId, { $push: { appliedjobs: jobId } });
    return { updateJob, updateUser };
}

async function withdrawApplication(jobId, userId) {
    const updateJob = await Job.findByIdAndUpdate(jobId, { $pull: { candidates: userId } });
    const updateUser = await Candidate.findByIdAndUpdate(userId, { $pull: { appliedjobs: jobId } });
    return { updateJob, updateUser };
}

async function renderCandidateJobs(req, res) {
    const jobs = await Job.find();
    return res.render('candidatejobs', { jobs: jobs , messages: req.flash()});
}


async function candidateApply(req, res, next) {
    try {
        const id = req.params?.id;
        const job = await Job.findById(id);
        if (jobAlreadyApplied(job,req.user)) {
            req.flash('error', cons.applieddone);
            renderCandidateJobs(req,res);
        } else {
            const { updateJob, updateUser } = await applyForJob(id, req.user?.id);
            req.flash('success', cons.applysuccess);
            renderCandidateJobs(req,res);
        }
    } catch(err) {
        next(err);
    }
}

async function candidateWithDraw(req,res,next){
    try {
        const id = req.params?.id;
        const job = await Job.findById(id);
        console.log(job.Date);
        if (jobAlreadyApplied(job,req.user)) {
            const { updateJob, updateUser } = await withdrawApplication(id, req.user?.id);
            req.flash('success', cons.withdrawsuccess);
            renderCandidateJobs(req,res);
        } else {
            req.flash('error', cons.notapplied);
            renderCandidateJobs(req,res);
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
    candidateWithDraw,
    candidateAppliedJobsPage
}