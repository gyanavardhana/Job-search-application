const Candidate = require('../Models/candidatemodel');
const Job = require('../Models/jobsmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    candidateSignup,
    createToken,
    checkAuthenticated,
    checkNotAuthenticated,
    comparePassword,
    candidateLogout,
    candidateLogin,
} = require('../controllers/candidate');

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockResolvedValue('sahfhasfhakshfkdhfa'),
    verify: jest.fn(),
}));


describe('Candidate Controllers', () => {
    describe('candidateSignup', () => {
        it('should perform the signup perfectly', async () => {
            const req = {
                body: {
                    username: 'sample',
                    email: 'sample@email.com',
                    password: 'sample',
                    contact: 8886053548,
                    organization: 'aditya',
                },
                flash: jest.fn(),
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                render: jest.fn(),
                redirect: jest.fn()
            }
            const next = jest.fn();
            Candidate.prototype.save = jest.fn().mockResolvedValue();
            await candidateSignup(req, res, next);
            expect(bcrypt.hash).toHaveBeenCalledWith('sample', 10);
            expect(Candidate.prototype.save).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
            expect(req.flash).not.toHaveBeenCalled();
            expect(res.render).not.toHaveBeenCalled();
        });
        it('should handle mongodb dublicate error', async () => {
            const req = {
                body: {
                    username: 'sample',
                    email: 'sample@email.com',
                    password: 'sample',
                    contact: 8886053548,
                    organization: 'aditya',
                },
                flash: jest.fn(),
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                render: jest.fn(),
                redirect: jest.fn()
            }
            const next = jest.fn();
            const err = { code: 11000 };
            Candidate.prototype.save = jest.fn().mockRejectedValue(err);
            await candidateSignup(req, res, next);
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
            Candidate.prototype.save = jest.fn().mockRejectedValue(err);
            await candidateSignup(req, res, next);
            expect(res.render).not.toHaveBeenCalled();
            expect(req.flash).not.toHaveBeenCalled();
        })
    })

    describe('createToken', () => {
        it('should create and return the token', async () => {
            const id1 = '23424324';
            await createToken(id1);
            expect(jwt.sign).toHaveBeenCalledWith({ id: id1 }, process.env.JWT_KEY, { expiresIn: 1000 });
        });
    });

    describe('checkAuthenticated', () => {
        it('should check the authentication', async () => {
            const req = {
                cookies: {
                    jwt: 'sahfhasfhakshfkdhfa',
                },
                user: {},
            };
            const res = {
                redirect: jest.fn(),
            };
            const next = jest.fn();
            jwt.verify = jest.fn().mockResolvedValue();
            await checkAuthenticated(req, res, next)
            expect(jwt.verify).toHaveBeenCalledWith('sahfhasfhakshfkdhfa', process.env.JWT_KEY);
            expect(next).toHaveBeenCalled();
        });

        it('should redirect if token is not present', async () => {
            const req = {
                cookies: {},
            };
            const res = {
                redirect: jest.fn(),
            };
            const next = jest.fn();
            await checkAuthenticated(req, res, next)
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
        });
    });


    describe('checkNotAuthenticated', () => {
        it('should redirect to profile if token is present', async () => {
            const req = {
                cookies: {
                    jwt: 'sahfhasfhakshfkdhfa',
                },
                user: {},
            };
            const res = {
                redirect: jest.fn(),
            };
            const next = jest.fn();
            jwt.verify = jest.fn().mockResolvedValue();
            await checkNotAuthenticated(req, res, next);
            expect(jwt.verify).toHaveBeenCalledWith('sahfhasfhakshfkdhfa', process.env.JWT_KEY);
            expect(res.redirect).toHaveBeenCalledWith('/candidates/profile');
        })
        it('should call next if token is not present', async () => {
            const req = {
                cookies: {},
            };
            const res = {
                redirect: jest.fn(),
            };
            const next = jest.fn();
            await checkNotAuthenticated(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('comparePassword', () => {
        it('should compare the password', async () => {
            const user = {
                password: 'sample'
            }
            const password = 'sample'
            const result = await comparePassword(password, user);
            expect(result).toBe(true);
        })
    })

    describe('candidateLogout', () => {
        it('should logout the candidate', async () => {
            const res = {
                cookie: jest.fn(),
                redirect: jest.fn()
            }
            await candidateLogout({}, res);
            expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 1 });
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/login');
        })
    })

    describe('candidateLogin', () => {
        it('should login successfully', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                redirect: jest.fn(),
            };
            const next = jest.fn();
            Candidate.findOne = jest.fn().mockResolvedValue({ _id: '123', email: 'test@example.com' });
    
            await candidateLogin(req, res, next);
    
            expect(Candidate.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(res.cookie).toHaveBeenCalledWith('jwt', "sahfhasfhakshfkdhfa", { maxAge: 259200000 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.redirect).toHaveBeenCalledWith('/candidates/profile');
        });
        it('if user not found', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
                flash: jest.fn(),
            };
            const res = {
                cookie: jest.fn(),
                status: jest.fn().mockReturnThis(),
                redirect: jest.fn(),
            };
            const next = jest.fn();
            Candidate.findOne = jest.fn().mockResolvedValue(null);
            await candidateLogin(req, res, next);
    
            expect(Candidate.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(res.cookie).not.toHaveBeenCalledWith('jwt', "sahfhasfhakshfkdhfa", { maxAge: 259200000 });
            expect(res.status).not.toHaveBeenCalledWith(200);
            expect(req.flash).toHaveBeenCalledWith('error', "User not found");
            expect(res.redirect).toHaveBeenCalledWith('/recruiters/signup');
        });
      
        it('should handle errors', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const res = {};
            const next = jest.fn();
            Candidate.findOne = jest.fn().mockRejectedValue(new Error('Some error'));
    
            await candidateLogin(req, res, next);
    
            expect(next).toHaveBeenCalledWith(new Error('Some error'));
        });
    
    })

});

