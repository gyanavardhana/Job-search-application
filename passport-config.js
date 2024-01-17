const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const datadictionary = require('./exports');

async function initialize(passport, getuserbyemail, getuserbyid) {
    const authenticateuser = async (email, password, done) => {
        try {
            const user = await getuserbyemail(email);
            if (!user) {
                return done(null, false, { message: 'No user with that email', statusCode: datadictionary.notfound });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return done(null, user, { message: 'Login Successful' , statusCode: datadictionary.ok});
            } else {
                return done(null, false, { message: 'Password incorrect' , statusCode: datadictionary.unauthorized});
            }
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new localStrategy({ usernameField: 'email' }, authenticateuser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async(id, done) => {
        return done(null, await getuserbyid(id))
    });
}

module.exports = initialize;