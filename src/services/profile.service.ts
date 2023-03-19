import { Request, Response } from "express";
import { IUser, User } from "../models/User.model";

export const getUserProfile = (req: Request, res: Response) => {
  const { _id, fullName, email, lastActivity, emailConfirmed } =
    req.user as IUser;
  res.json({ _id, fullName, email, lastActivity, emailConfirmed });
};

export const updateUserProfile = (req: Request, res: Response) => {
  const user = req.user as IUser;
  User.findOneAndUpdate(
    { _id: user?._id },
    {
      fullName: req.body.fullName,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        lastActivity: user.lastActivity,
        emailConfirmed: user.emailConfirmed,
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export default {
  getUserProfile,
  updateUserProfile,
};
