const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const router = express.Router();
const passport = require('passport');
const methodOveride = require('method-override');
const initializePassport = require('../passport-config');
const datadictionary = require('../exports');
const { recruitersignup, getuserbyemail, getuserbyid , checkAuthenticated, checkNotAuthenticated} = require('../controllers/recruiter');
initializePassport(passport, getuserbyemail, getuserbyid);

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: 'dfgadgafsgvsgasfavsfbagav',
    resave: false,
    saveUninitialized: false
}));
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOveride('_method'));



router.get('/recruiters/profile', checkAuthenticated, (req, res) => {
    res.render('profile',{messages: req.flash()});
})

router.get('/recruiters/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { messages: req.flash() });
})

router.get('/recruiters/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup');
});

router.post('/recruiters/signup', recruitersignup);

router.post('/recruiters/login', passport.authenticate('local', {
    successRedirect: '/recruiters/profile',
    failureRedirect: '/recruiters/login',
    failureFlash: true
}));

router.delete('/recruiters/logout', (req, res) => {
    req.logOut();
    res.redirect('/recruiters/login');
})



module.exports = router;