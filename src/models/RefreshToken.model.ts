import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  expireAt: Date;
}

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

export const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "refreshTokens"
);
