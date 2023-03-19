import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../models/User.model";

export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate("jwt", { session: false }, (err: Error, user: IUser, challenges: Array<any>) => {
    if (err || !user || challenges) {
      return res
        .status(401)
        .json(err || challenges)
        .end();
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
