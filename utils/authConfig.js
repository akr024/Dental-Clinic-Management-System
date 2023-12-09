const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const PatientModel = require('../models/Patient')

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'personnummer',
      passwordField: 'password'
    },
    async (personnummer, password, done) => {
      try {
        const user = await PatientModel.findOne({ Personnummer: personnummer });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
module.exports = passport;
