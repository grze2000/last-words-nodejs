import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { IUser, User } from "../models/User.model";

export const configurePassport = () => {
  const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
  };
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findOne({_id: jwtPayload.id}, (err: Error, user: IUser) => {
      if(err) return done(err, false);
      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }))
}