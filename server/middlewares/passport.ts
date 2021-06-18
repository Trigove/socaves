import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { jwtConfig } from '../config';

passport.use(new AnonymousStrategy());

const cookieExtractor = (req: Request) => {
  const jwt = req.cookies?.jwt;
  return jwt;
};

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtConfig.secret,
    },
    (jwtPayload, done) => {
      const { expiration } = jwtPayload;
      if (Date.now() > expiration) {
        done('Unauthorized', false);
      }
      done(null, jwtPayload);
    }
  )
);
