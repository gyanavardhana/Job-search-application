const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const router = express.Router();
const { recruitersignup, recruiterlogin } = require('../controllers/recruiter');



router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
router.use(flash());


router.get('/recruiters/profile',(req,res)=>{
    res.render('profile', {messages: req.flash()});
})

router.get('/recruiters/login',(req,res)=>{
    res.render('login', {messages: req.flash()});
})

router.get('/recruiters/signup',(req,res)=>{
    res.render('signup');
});

router.post('/recruiters/signup', recruitersignup);

router.post('/recruiters/login', recruiterlogin);

module.exports = router;