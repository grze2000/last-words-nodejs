import mongoose, { Document, Schema } from "mongoose";
import { TRIGGER_TYPE } from "../enums/triggerType.enum";
import { IUser } from "./User.model";

export interface IMessage extends Document {
  _id: string;
  triggerType: TRIGGER_TYPE;
  triggerDate: Date;
  afterInactivity: number;
  sent: Date;
  phoneNumber: string;
  smsMessage: string;
  email: string;
  emailMessage: string;
  user: IUser;
  files: Array<string>;
  deletedAt: Date;
}

export const messageSchema = new Schema<IMessage>({
  triggerType: {
    type: String,
    required: true,
    enum: Object.values(TRIGGER_TYPE),
  },
  triggerDate: Date,
  afterInactivity: Number,
  sent: Date,
  phoneNumber: String,
  smsMessage: String,
  email: String,
  emailMessage: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  files: [String],
  deletedAt: Date,
});

export const Message = mongoose.model<IMessage>("Message", messageSchema, "messages");