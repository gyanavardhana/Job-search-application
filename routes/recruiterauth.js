const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOveride = require('method-override');
const router = express.Router();
const passport = require('passport');
const rController = require('../controllers/recruiter');



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
rController.checkNotAuthenticated,
rController.recruiterSignupPage);

router.get('/recruiters/login', 
rController.checkNotAuthenticated, 
rController.recruiterLoginPage);

router.get('/recruiters/profile', 
rController.checkAuthenticated, 
rController.recruiterProfilePage);

router.post('/recruiters/signup', 
rController.recruitersignup);

router.post('/recruiters/login',
rController.recruiterlogin);

router.delete('/recruiters/logout', 
rController.recruiterlogout);



module.exports = router;