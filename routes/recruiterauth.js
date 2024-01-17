const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const router = express.Router();
const passport = require('passport');
const methodOveride = require('method-override');
const initializePassport = require('../passport-config');
const recruiterController = require('../controllers/recruiter');
initializePassport(passport, recruiterController.getuserbyemail, recruiterController.getuserbyid);



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






router.get('/recruiters/signup', 
recruiterController.checkNotAuthenticated,
recruiterController.recruiterSignupPage);

router.get('/recruiters/login', 
recruiterController.checkNotAuthenticated, 
recruiterController.recruiterLoginPage);

router.get('/recruiters/profile', 
recruiterController.checkAuthenticated, 
recruiterController.recruiterProfilePage);

router.post('/recruiters/signup', 
recruiterController.recruitersignup);

router.post('/recruiters/login', passport.authenticate('local', {
    successRedirect: '/recruiters/profile',
    failureRedirect: '/recruiters/login',
    failureFlash: true
}));

router.delete('/recruiters/logout', 
recruiterController.recruiterlogout);



module.exports = router;