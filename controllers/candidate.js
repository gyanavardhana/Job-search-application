const Candidate = require('../Models/candidatemodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const datadictionary = require('../exports');

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

async function checkAuthenticated(req,res,next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/candidates/login');
    }
    try {
        const decoded = jwt.verify(token, 'sahfhasfhakshfkdhfa');
        req.user = decoded;
        next();
    } catch (error) {
        next(err);
    }
}

async function checkNotAuthenticated(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        next();
    }else{
        res.redirect('/recruiters/login');
    }

}

async function candidateLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password)
    try {
        const user = await Candidate.findOne({ email: email });
        console.log(user);
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = await createToken(user._id);
                res.cookie('jwt', token, { maxAge: 1000*60*60*24*3 });
                res.status(datadictionary.ok).redirect('/candidates/profile');
            } else {
                req.flash('error', datadictionary.invalidlogin);
                res.redirect('/recruiters/login');
            }
        } else {
            req.flash('error', datadictionary.nouser);
            res.redirect('/recruiters/login');
        }
    } catch (err) {
        next(err);
    }
}

function candidateProfile(req, res) {
    return res.render('candidateprofile');
}

module.exports = {
    candidateSignup,
    candidateLogin,
    candidateProfile,
    checkAuthenticated,
    checkNotAuthenticated
}