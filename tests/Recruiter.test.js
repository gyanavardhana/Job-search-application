
const bcrypt = require('bcrypt');
const passport = require('passport');
const Job = require('../Models/jobsmodel');
const Recruiter = require('../Models/recruitermodel');
const fs = require('fs');
const path = require('path');
const {
    recruitersignup,
    getuserbyemail,
    getuserbyid,
    recruiterPostaJob,
    recruiterMyJobs,
    recruiterDeleteJob,
    recruiterlogout,
    checkAuthenticated,
    checkNotAuthenticated,
    recruiterlogin

} = require('../controllers/recruiter')

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('passport', () => ({
    authenticate: jest.fn(),
    use: jest.fn(),
    serializeUser: jest.fn(),   
    deserializeUser: jest.fn(), 
}));


describe('recruiters controllers', () => {
    describe('recruitersignup', () => {
        it('should sign up a recruiter successfully', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    contact: '1234567890',
                    company: 'Test Company',
                },
                flash: jest.fn(),
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                redirect: jest.fn(),
                render: jest.fn(),
            };
            Recruiter.prototype.save = jest.fn();
            await recruitersignup(req, res);
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
            expect(Recruiter.prototype.save).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
            expect(req.flash).not.toHaveBeenCalled();
            expect(res.render).not.toHaveBeenCalled();
        });

        it('should handle MongoDB duplicate key error', async () => {
            const req = {
                body: {
                    username: 'duplicateuser',
                    email: 'duplicate@example.com',
                    password: 'testpassword',
                    contact: '1234567890',
                    company: 'Duplicate Company',
                },
                flash: jest.fn(),
            };
            const res = {
                render: jest.fn(),
            };
            const err = { code: 11000 };
            Recruiter.prototype.save = jest.fn().mockRejectedValue(err);
            await recruitersignup(req, res);
            expect(req.flash).toHaveBeenCalledWith('error', 'User already exists');
            expect(res.render).toHaveBeenCalledWith('signup', { messages: req.flash() });
        });

        it('should handle other errors', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    contact: '1234567890',
                    company: 'Test Company',
                },
                flash: jest.fn(),
            };
            const res = {
                render: jest.fn(),
            };
            const next = jest.fn();

            const err = new Error('Some other error');
            Recruiter.prototype.save = jest.fn().mockRejectedValue(err);
            await recruitersignup(req, res, next);
            expect(res.render).not.toHaveBeenCalled();
            expect(req.flash).not.toHaveBeenCalled();
        });
    });

    describe('getuserbyemail', () => {
        it('should return user with given email', async () => {
            const user = {
                username: 'testuser',
                email: 'test@email.com',
            };
            Recruiter.findOne = jest.fn().mockResolvedValue(user);

            const res = await getuserbyemail('test@email.com');
            expect(Recruiter.findOne).toHaveBeenCalledWith({ email: 'test@email.com' });
            expect(res).toEqual(user);
        });
    });

    describe('getuserbyid', () => {
        it('should return user with id', async () => {
            const user = {
                username: 'testuser',
                email: 'test@email.com',
            };
            Recruiter.findById = jest.fn().mockResolvedValue(user);

            const res = await getuserbyid(234234);
            expect(Recruiter.findById).toHaveBeenCalledWith(234234);
            expect(res).toEqual(user);
        });
    });

    describe('recruiterPostaJob', () => {
        it('should post a job successfully', async () => {
            const req = {
                body: {
                    title: 'testjob',
                    salary: 'testsalary',
                    location: 'testlocation',
                    company: 'testcompany',
                    description: 'testdescription',
                    recruiter: 234,
                    candidates: [],
                    
                },
                user: {
                    _id: 234,
                },
                file: 'testfile',
                flash: jest.fn(),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
                render: jest.fn(),
            }

            Job.prototype.save = jest.fn().mockResolvedValue();
            await recruiterPostaJob(req, res, next);
            expect(Job.prototype.save).toHaveBeenCalledWith();
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/home');
            expect(req.flash).not.toHaveBeenCalled();
            expect(res.render).not.toHaveBeenCalled();
        });

        it('should handle the erros', async()=> {
            const req = {
                body: {
                    title: 'testjob',
                    salary: 'testsalary',
                    location: 'testlocation',
                    company: 'testcompany',
                    description: 'testdescription',
                    recruiter: 234,
                    candidates: [],
                    
                },
                user: {
                    _id: 234,
                },
                file: 'testfile',
                flash: jest.fn(),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
                render: jest.fn(),
            }

            Job.prototype.save = jest.fn().mockRejectedValue(new Error('Some error'));
            await recruiterPostaJob(req, res, next);
            expect(Job.prototype.save).toHaveBeenCalledWith();
            expect(res.redirect).not.toHaveBeenCalledWith('/recruiters/home');
            expect(req.flash).not.toHaveBeenCalled();
            expect(res.render).not.toHaveBeenCalled();
        })


        it('should handle empty file error', async()=> {
            const req = {
                body: {
                    title: 'testjob',
                    salary: 'testsalary',
                    location: 'testlocation',
                    company: 'testcompany',
                    description: 'testdescription',
                    recruiter: 234,
                    candidates: [],
                    
                },
                user: {
                    _id: 234,
                },
                flash: jest.fn(),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
                render: jest.fn(),
            }

            Job.prototype.save = jest.fn().mockRejectedValue(new Error('Some error'));
            await recruiterPostaJob(req, res, next);
            expect(Job.prototype.save).not.toHaveBeenCalledWith();
            expect(res.redirect).not.toHaveBeenCalledWith('/recruiters/home');
            expect(req.flash).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalled();
        })
    });

    describe('recruiterMyJobs',()=>{
        it('should send all recruiter jobs', async ()=>{
             const req = {
                user: {
                    _id: 234,
                },
                flash: jest.fn(),
             }
             const next = jest.fn();
             const res = {
                render: jest.fn(),
            }

            Job.find = jest.fn().mockResolvedValue();
            await recruiterMyJobs(req, res, next);
            expect(Job.find).toHaveBeenCalledWith({ recruiter: 234 });
            expect(res.render).toHaveBeenCalled();
        });

        it('should handle the errors', async() =>{
            const req = {
                user: {
                    _id: 234,
                },
                flash: jest.fn(),
             }
             const next = jest.fn();
             const res = {
                render: jest.fn(),
            }
            Job.find = jest.fn().mockRejectedValue();
            await recruiterMyJobs(req, res, next);
            expect(Job.find).toHaveBeenCalledWith({ recruiter: 234 });
            expect(res.render).not.toHaveBeenCalled();
        });
    });

    describe('recruiterDeleteJob', () => {
        it('should delete a job successfully', async () => {
            const req = {
                params: {
                    id: 234,
                },
                flash: jest.fn(),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
    
            const job = { _id: 234, file: '1706974730640-Full Stack Developer.pdf' };
            Job.findById = jest.fn().mockResolvedValue(job);
            Job.findByIdAndDelete = jest.fn().mockResolvedValue();
            fs.unlink = jest.fn().mockResolvedValue();
            await recruiterDeleteJob(req, res, next);
            expect(Job.findById).toHaveBeenCalledWith(234);
            expect(Job.findByIdAndDelete).toHaveBeenCalledWith(234);
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/home');
        })

        it('should handle error', async () => {
            const req = {
                params: {
                    id: 234,
                },
                flash: jest.fn(),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
            const job = { _id: 234, file: '1706974730640-Full Stack Developer.pdf' };
            Job.findById = jest.fn().mockRejectedValue(job);
            Job.findByIdAndDelete = jest.fn().mockRejectedValue();
            fs.unlink = jest.fn().mockRejectedValue();
            await recruiterDeleteJob(req, res, next);
            expect(Job.findById).toHaveBeenCalledWith(234);
            expect(Job.findByIdAndDelete).not.toHaveBeenCalledWith(234);
            expect(res.redirect).not.toHaveBeenCalledWith('/recruiters/home');
        });
    });

    describe('recruiterlogout', () => {

        it('should logout a recruiter successfully', async () => {
            const req = {
                logOut: jest.fn(),
            };
            const res = {
                redirect: jest.fn(),
            };
            await recruiterlogout(req, res);
            expect(req.logOut).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
        });

        it('should logout a recruiter successfully', async () => {
            const req = {
                logOut: jest.fn().mockReturnValue(false),
            };
            const res = {
                redirect: jest.fn(),
            };
            await recruiterlogout(req, res);
            expect(req.logOut).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
        });
    });

    describe('checkAuthenticated',()=>{
        it('should check if user is authenticated', async ()=>{
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
            await checkAuthenticated(req, res, next);
            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            expect(res.redirect).not.toHaveBeenCalled();
        });

        it('should redirect if user is not authenticated', async ()=>{
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
            await checkAuthenticated(req, res, next);
            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalled();
        });
    })

    describe('checkNotAuthenticated',()=>{
        it('should check if user is authenticated', async ()=>{
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(true),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
            await checkNotAuthenticated(req, res, next);
            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalled();
        });

        it('should redirect if user is not authenticated', async ()=>{
            const req = {
                isAuthenticated: jest.fn().mockReturnValue(false),
            }
            const next = jest.fn();
            const res = {
                redirect: jest.fn(),
            }
            await checkNotAuthenticated(req, res, next);
            expect(req.isAuthenticated).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            expect(res.redirect).not.toHaveBeenCalled();
        });
    });

    describe('recruiterlogin', () => {
        it('should redirect to /recruiters/profile if authentication is successful', async () => {
            const req = {};
            const res = {
                redirect: jest.fn() 
            };
            const next = jest.fn();
    
            passport.authenticate = jest.fn().mockImplementation((strategy, options, callback) => {
                return jest.fn();
            });
            await recruiterlogin(req, res, next);
            expect(passport.authenticate).toHaveBeenCalledWith('local', {
                successRedirect: '/recruiters/profile',
                failureRedirect: '/recruiters/login',
                failureFlash: true
            });
        });
    });

});





    
    
