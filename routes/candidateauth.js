require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOveride = require('method-override');
const router = express.Router();
const rController = require('../controllers/recruiter');
const cController = require('../controllers/candidate');
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
router.use(flash());
router.use(methodOveride('_method'));
router.use(cookieParser());
router.use(rController.ifError);

router.get('/candidates/profile',
 cController.checkAuthenticated,
 cController.candidateProfile);

router.get('/candidates/apply',
 cController.checkAuthenticated,
 cController.candidateApplyPage);

router.get('/candidates/appliedjobs',
cController.checkAuthenticated,
cController.candidateAppliedJobsPage);

router.post('/candidates/signup', 
cController.candidateSignup);

router.post('/candidates/login',
cController.candidateLogin);

router.delete('/candidates/logout',
cController.candidateLogout);

router.patch('/candidates/apply/:id',
cController.checkAuthenticated,
cController.candidateApply);

router.delete('/candidates/withdraw/:id',
cController.checkAuthenticated,
cController.candidateWithDraw);


module.exports = router;

