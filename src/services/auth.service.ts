import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { IRefreshToken, RefreshToken } from "../models/RefreshToken.model.js";
import { IUser, IUserMethods, User } from "../models/User.model.js";

interface TokenPayload {
  id: Types.ObjectId;
}

export const login = (req: Request, res: Response) => {
  User.findOne(
    { email: req.body.email },
    (err: Error, user: IUser & IUserMethods) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!user) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy email lub hasło" });
      }
      user.comparePassword(
        req.body.password,
        (err: Error | null, isMatch: boolean | undefined) => {
          if (!err && isMatch) {
            const expirationDate = new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 30
            );
            const accessToken = jwt.sign(
              {
                id: user._id,
              },
              process.env.SECRET || "secret",
              {
                expiresIn: 60 * 60,
              }
            );

            const refreshToken = jwt.sign(
              {
                id: user._id,
              },
              process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
              {
                expiresIn: 60 * 60 * 24 * 30,
              }
            );

            const newRefreshToken = new RefreshToken({
              token: refreshToken,
              expireAt: expirationDate,
            });

            newRefreshToken.save((err) => {
              if (err) {
                res.status(500).json({ message: "Database error" });
              } else {
                res.json({
                  accessToken,
                  refreshToken,
                  userId: user._id,
                  email: user.email,
                });
              }
            });
          } else {
            res.status(400).json({ message: "Nieprawidłowy email lub hasło" });
          }
        }
      );
    }
  );
};

export const register = (req: Request, res: Response) => {
  const { email } = req.body;

  User.findOne(
    {
      email,
    },
    (err: Error | null, user: IUser) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (user) {
        return res
          .status(400)
          .json({ message: "Użytkownik z takim mailem już istnieje" });
      }
      const userId = Math.random().toString().substr(2, 14);
      const userData: IUser = {
        ...req.body,
        userId,
      };

      User.create(userData)
        .then((user: IUser) => {
          const expirationDate = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
          );
          const accessToken = jwt.sign(
            {
              id: user._id,
            },
            process.env.SECRET || "secret",
            {
              expiresIn: 60 * 15,
            }
          );

          const refreshToken = jwt.sign(
            {
              id: user._id,            },
            process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
            {
              expiresIn: 60 * 60 * 24 * 30,
            }
          );

          RefreshToken.create({
            token: refreshToken,
            expireAt: expirationDate,
          })
            .then(() => {
              res.status(201).json({
                accessToken,
                refreshToken,
                email: user.email,
              });
            })
            .catch((err: Error) => {
              console.log(err);
              return res.status(500).json({ message: "Database error" });
            });
        })
        .catch((err: Error) => {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        });
    }
  );
};

export const refreshToken = (req: Request, res: Response) => {
  RefreshToken.findOne(
    { token: req.body.token },
    (err: Error, token: IRefreshToken) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!token) {
        return res.status(400).json({ message: "Nieprawidłowy token" });
      }

      try {
        const user = jwt.verify(
          req.body.token,
          process.env.REFRESH_TOKEN_SECRET || "refresh_secret"
        ) as TokenPayload;

        if (!user) {
          return res.status(400).json({ message: "Nieprawidłowy token" });
        }

        const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.SECRET || "secret",
          {
            expiresIn: 60 * 60,
          }
        );
        const refreshToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
          {
            expiresIn: 60 * 60 * 24 * 30,
          }
        );

        token.token = refreshToken;
        token.expireAt = expirationDate;
        token.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Database error" });
          }
          res.json({
            accessToken,
            refreshToken,
          });
        });
      } catch (err) {
        return res.status(400).json({ message: "Nieprawidłowy token" });
      }
    }
  );
};

export const revokeToken = (req: Request, res: Response) => {
  RefreshToken.findOneAndDelete(
    { token: req.body.token },
    (err: Error, token: IRefreshToken) => {
      if (err || !token) {
        res.status(400).json({ message: "Nieprawidłowy token" });
      } else {
        res.sendStatus(200);
      }
    }
  );
};