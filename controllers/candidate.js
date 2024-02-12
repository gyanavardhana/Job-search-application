require('dotenv').config();
const Candidate = require('../Models/candidatemodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cons = require('../constants');

const candidateProfile = async (req, res) => {
    const user = await Candidate.findById(req?.user?.id);
    return res.render('candidateprofile', { user: user });
};

const candidateSignup = async (req, res, next) => {
    try {
        const candidate = new Candidate({
            username: req?.body?.username,
            email: req?.body?.email,
            password: await bcrypt.hash(req?.body?.password, 10),
            contact: req?.body?.contact,
            education: req?.body?.organization
        });
        await candidate.save();
        res.status(cons.ok).redirect('/recruiters/login');
    } catch (err) {
        if (err.code === cons.mongoerror) {
            req?.flash('error', cons.userexists);
            res.render('signup', { messages: req?.flash() });
        } else {
            next(err);
        }
    }
};

const createToken = async (id) => {
    const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: 1000 });
    return token;
};

const checkAuthenticated = async (req, res, next) => {
    const token = req?.cookies?.jwt;
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
};

const checkNotAuthenticated = async (req, res, next) => {
    const token = req?.cookies?.jwt;
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
};

const comparePassword = async (password, user) => {
    const auth = await bcrypt.compare(password, user?.password);
    return auth;
};

const candidateLogin = async (req, res, next) => {
    const email = req?.body?.email;
    const password = req?.body?.password;
    expirydate = 1000 * 60 * 60 * 24 * 3
    try {
        const user = await Candidate.findOne({ email: email });
        if (user) {
            const auth = await comparePassword(password, user);
            if (auth) {
                const token = await createToken(user?._id);
                res.cookie('jwt', token, { maxAge: expirydate });
                res.status(cons.ok).redirect('/candidates/profile');
            } else {
                req?.flash('error', cons.invalidlogin);
                res.redirect('/recruiters/login');
            }
        } else {
            req?.flash('error', cons.nouser);
            res.redirect('/recruiters/signup');
        }
    } catch (err) {
        next(err);
    }
};

const candidateLogout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.redirect('/recruiters/login');
};

const candidateAppliedJobsPage = async (req, res) => {
    try {
        const jobs = await Job.find({ candidates: { $in: [req?.user?.id] } });
        res.render('AppliedJobs', { jobs: jobs });
    } catch (err) {
        next(err);
    }
};

const candidateApplyPage = async (req, res) => {
    const jobs = await Job.find();
    res.render('candidatejobs', { jobs: jobs, messages: req?.flash() });
};

const jobAlreadyApplied = (job, user) => job.candidates.includes(user?.id);

const applyForJob = async (jobId, userId) => {
    const updateJob = await Job.findByIdAndUpdate(jobId, { $push: { candidates: userId } });
    const updateUser = await Candidate.findByIdAndUpdate(userId, { $push: { appliedjobs: jobId } });
    return { updateJob, updateUser };
};

const withdrawApplication = async (jobId, userId) => {
    const updateJob = await Job.findByIdAndUpdate(jobId, { $pull: { candidates: userId } });
    const updateUser = await Candidate.findByIdAndUpdate(userId, { $pull: { appliedjobs: jobId } });
    return { updateJob, updateUser };
};

const candidateApply = async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const job = await Job.findById(id);
        if (jobAlreadyApplied(job, req?.user)) {
            req?.flash('error', cons.applieddone);
            res.redirect('/candidates/apply');
        } else {
            const { updateJob, updateUser } = await applyForJob(id, req?.user?.id);
            req?.flash('success', cons.applysuccess);
            res.redirect('/candidates/apply');
        }
    } catch (err) {
        next(err);
    }
};

const candidateWithDraw = async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const job = await Job.findById(id);
        console.log(job.Date);
        if (jobAlreadyApplied(job, req?.user)) {
            const { updateJob, updateUser } = await withdrawApplication(id, req?.user?.id);
            req?.flash('success', cons.withdrawsuccess);
            res.redirect('/candidates/apply');
        } else {
            req?.flash('error', cons.notapplied);
            res.redirect('/candidates/apply');
        }
    } catch (err) {
        next(err);
    }
};

const homePage = (req, res) => {
    res.render('Home');
}

const contactPage = (req, res) => {
    res.render('contact');
}

module.exports = {
    candidateSignup,
    candidateLogin,
    createToken,
    comparePassword,
    candidateProfile,
    checkAuthenticated,
    checkNotAuthenticated,
    candidateLogout,
    candidateApplyPage,
    candidateApply,
    candidateWithDraw,
    candidateAppliedJobsPage,
    homePage,
    contactPage
};
