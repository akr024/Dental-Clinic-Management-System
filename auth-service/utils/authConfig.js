const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const PatientModel = require('../models/Patient')
const DentistModel = require('../models/dentistSchema')
require("../models/clinicSchema.js")
passport.use(
  'loginPatient',
  new localStrategy(
    {
      usernameField: 'personnummer',
      passwordField: 'password'
    },
    async (personnummer, password, done) => {
      try {
        let user = await PatientModel.findOne({ personnummer: personnummer });
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
passport.use(
  'loginDentist',
  new localStrategy(
    {
      usernameField: 'personnummer',
      passwordField: 'password'
    },
    async (personnummer, password, done) => {
      try {
        let user = await DentistModel.findOne({ personnummer: personnummer }).populate('clinics');
        if (!user) {
          return done(null, false, { message: 'Dentist not found' });
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