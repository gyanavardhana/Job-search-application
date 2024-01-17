
const Recruiter = require('../Models/recruitermodel');
const bcrypt = require('bcrypt');

const datadictionary = {
    "ok": 200,
    "created": 201,
    "badrequest": 400,
    "unauthorized": 401,
    "forbidden": 403,
    "notfound": 404,
    "conflict": 409,
    "internalerror": 500,
    "invalid": "Invalid Credentials",
    "success": "Login Successful",
}
async function recruitersignup (req,res){
    const recruiter = new Recruiter(
        {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            company: req.body.company
        }
    )
    await recruiter.save()
    .then((result)=>{
        res.redirect('/recruiters/login');
    })
    .catch((err)=>{
        console.log(err);
    })
}

async function recruiterlogin(req,res){
    const { email, password } = req.body;
    let user = await Recruiter.findOne({ email });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            req.flash('success', datadictionary.success);   
            res.status(datadictionary.ok).redirect('/recruiters/profile' );
        } else {
            req.flash('error', datadictionary.invalid);
            res.status(datadictionary.unauthorized).redirect('/recruiters/login' );
        }
    } else {
        req.flash('error', 'Invalid Credentials');
        res.status(datadictionary.unauthorized).redirect('/recruiters/login');
    }
} 

module.exports = {
    recruitersignup,
    recruiterlogin
}