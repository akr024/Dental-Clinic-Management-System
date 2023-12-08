const UserModel = require('../models/User');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


// Passport middleware for user signup

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'personnummer',
      passwordField: 'password',
    },
    async (personnummer, password, done) => {
      try {
        // Check if a user with the same personnummer already exists
        const existingUser = await UserModel.findOne({ personnummer });

        if (existingUser) {
          return done(null, false, { message: 'User with the same personnummer already exists' });
        }

        // If no existing user, proceed with creating a new user
        const newUser = await UserModel.create({ personnummer, password });

        return done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'personnummer',
      passwordField: 'password'
    },
    async (personnummer, password, done) => {
      try {
        const user = await UserModel.findOne({ personnummer });

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
