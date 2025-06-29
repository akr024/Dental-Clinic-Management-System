import passport from 'passport';
import { Strategy as JWTstrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';


passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      // Extract the JWT from the request Authorization header
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user); 
      } catch (error) {
        done(error);
      }
    }
  )
);
export default passport;
