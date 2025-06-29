const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'loginPatient',
      async (err, user, info) => {
        try {
          if (err) {          
            return res.status(401).json({
                            error: err.message,
                          });
          }
          if (!user) {
            const error = new Error('Invalid credentials');
          
            return res.status(401).json({
                            error: error.message,
                          });
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);
router.post(
  '/dentist/login',
  async (req, res, next) => {
    passport.authenticate(
      'loginDentist',
      async (err, user, info) => {
        try {
          if (err) {          
            return res.status(401).json({
                            error: err.message,
                          });
          }
          if (!user) {
            const error = new Error('Invalid credentials');
          
            return res.status(401).json({
                            error: error.message,
                          });
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, email: user.email };
              const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

              return res.json(user);
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);
module.exports = router;