import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Error } from "mongoose";
import { IMessage, Message } from "../models/Message.model";
import { IUser } from "../models/User.model";

const createMessage = (req: Request, res: Response) => {
  const user = req.user as IUser;
  Message.create({
    ...req.body,
    user: user._id,
  })
    .then((message: IMessage) => {
      return res.status(201).json(message);
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export const getMessages = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const filters = {
    user: user._id,
    deletedAt: null,
  };
  const count = await Message.count(filters);
  const pageSize = Number(req.query.pageSize) || 25;
  const pageNumber = Number(req.query.pageNumber) || 1;

  Message.find(
    filters,
    { __v: 0 },
    {
      sort: { date: -1 },
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
    }
  )
    .populate("user", { __v: 0, password: 0 })
    .then((messages: IMessage[]) => {
      return res.status(200).json({
        data: messages,
        pageSize,
        pageNumber,
        totalPages: Math.ceil(count / pageSize),
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export const getMessage = (req: Request, res: Response) => {
  const user = req.user as IUser;
  Message.findOne(
    {
      user: user._id,
      _id: req.params.messageId,
      deletedAt: null,
    },
    {
      __v: 0,
    }
  )
    .populate("user", { __v: 0, password: 0 })
    .then((message: IMessage | null) => {
      if (!message) {
        return res.sendStatus(404);
      }
      return res.status(200).json(message);
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export const updateMessage = (req: Request, res: Response) => {
  const user = req.user as IUser;
  Message.findOneAndUpdate(
    {
      user: user._id,
      _id: req.params.messageId,
      deletedAt: null,
    },
    {
      triggerType: req.body.triggerType,
      triggerDate: req.body.triggerDate,
      afterInactivity: req.body.afterInactivity,
      phoneNumber: req.body.phoneNumber,
      smsMessage: req.body.smsMessage,
      email: req.body.email,
      emailMessage: req.body.emailMessage,
    }
  )
    .then((message) => {
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      return res.sendStatus(200);
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export const deleteMessage = (req: Request, res: Response) => {
  const user = req.user as IUser;
  Message.findOneAndUpdate(
    {
      user: user._id,
      _id: req.params.messageId,
      deletedAt: null,
    },
    {
      deletedAt: new Date(),
    }
  )
    .then((message) => {
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      return res.sendStatus(200);
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: "Server error" });
    });
};

export default {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
