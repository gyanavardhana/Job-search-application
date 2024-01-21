const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const methodOveride = require('method-override');
const router = express.Router();
const rController = require('../controllers/recruiter');
const cController = require('../controllers/candidate');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: 'dfgadgafsgvsgasfavsfbagav',
    resave: false,
    saveUninitialized: false
}));
router.use(flash());
router.use(methodOveride('_method'));
router.use(rController.ifError);

router.get('/candidates/profile', cController.candidateProfile);

router.post('/candidates/signup', cController.candidateSignup);

router.post('/candidates/login', cController.candidateLogin);

module.exports = router;

