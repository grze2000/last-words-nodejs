import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  password: string;
  email: string;
  emailConfirmed: boolean;
  lastActivity: Date;
}

export interface IUserMethods {
  comparePassword: (
    password: string,
    cb: (error: Error | null, isMath?: boolean) => void
  ) => void;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  emailConfirmed: Boolean,
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

userSchema.method(
  "comparePassword",
  function (
    password: string,
    cb: (error: Error | null, isMath?: boolean) => void
  ) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
);

export const User = mongoose.model<IUser, UserModel>(
  "User",
  userSchema,
  "users"
);
