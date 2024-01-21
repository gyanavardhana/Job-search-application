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
router.use(rController.ifError);



router.get('/recruiters/signup', 
rController.recruiterCheckNotAuthenticated,
rController.recruiterSignupPage);

router.get('/recruiters/login', 
rController.recruiterCheckNotAuthenticated, 
rController.recruiterLoginPage);

router.get('/recruiters/profile', 
rController.recruiterCheckAuthenticated, 
rController.recruiterProfilePage);

router.post('/recruiters/signup', 
rController.recruitersignup);

router.post('/recruiters/login',
rController.recruiterCheckNotAuthenticated,
rController.recruiterlogin);

router.get('/recruiters/home',
rController.recruiterCheckAuthenticated,
rController.recruiterMyJobs,
rController.recruiterHomePage);

router.get('/recruiters/postjobs',
rController.recruiterCheckAuthenticated,
rController.recruiterPostPage);

router.post('/recruiters/postajob',
rController.recruiterCheckAuthenticated,
rController.recruiterPostaJob);

router.get('/recruiters/myjobs',
rController.recruiterCheckAuthenticated,
rController.recruiterMyJobs);

router.delete('/recruiters/myjobs/:id',
rController.recruiterCheckAuthenticated,
rController.recruiterDeleteJob);

router.delete('/recruiters/logout', 
rController.recruiterlogout);

module.exports = router;