import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { IRefreshToken, RefreshToken } from "../models/RefreshToken.model.js";
import { IUser, IUserMethods, User } from "../models/User.model.js";
import { IDENTIY_PROVIDERS } from "../enums/identityProviders.enum.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
interface TokenPayload {
  id: Types.ObjectId;
}

const createTokens = (user: IUser) => {
  const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
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

  return new RefreshToken(newRefreshToken).save().then(() => {
    return {
      accessToken,
      refreshToken,
    };
  });
};

const login = (req: Request, res: Response) => {
  User.findOne(
    { email: req.body.email },
    (err: Error, user: IUser & IUserMethods) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!user || !user.password) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy email lub hasło" });
      }
      user.comparePassword(
        req.body.password,
        (err: Error | null, isMatch: boolean | undefined) => {
          if (!err && isMatch) {
            return createTokens(user)
              .then((tokens) => {
                res.json({
                  ...tokens,
                  userId: user._id,
                  email: user.email,
                });
              })
              .catch((err) => {
                res.status(500).json({ message: "Database error" });
              });
          } else {
            res.status(400).json({ message: "Nieprawidłowy email lub hasło" });
          }
        }
      );
    }
  );
};

const register = (req: Request, res: Response) => {
  const { email } = req.body;

  User.findOne(
    {
      email,
    },
    (err: Error | null, user: IUser) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      if (user) {
        return res
          .status(400)
          .json({ message: "Użytkownik z takim mailem już istnieje" });
      }

      const userData: IUser = {
        ...req.body,
      };

      User.create(userData)
        .then((user: IUser) => {
          return createTokens(user)
            .then((tokens) => {
              res.json({
                ...tokens,
                userId: user._id,
                email: user.email,
              });
            })
            .catch((err) => {
              res.status(500).json({ message: "Server error" });
            });
        })
        .catch((err: Error) => {
          console.log(err);
          return res.status(500).json({ message: "Server error" });
        });
    }
  );
};

const refreshToken = (req: Request, res: Response) => {
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

const revokeToken = (req: Request, res: Response) => {
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

const loginWithProvider = (req: Request, res: Response) => {
  const { token, provider } = req.body;
  if (provider === IDENTIY_PROVIDERS.GOOGLE) {
    console.log(token);
    client
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      .then((ticket) => {
        const payload = ticket.getPayload();
        console.log(payload);
        User.findOne({
          email: payload?.email,
        })
          .then((user) => {
            if (!user) {
              const userData: Partial<IUser> = {
                email: payload!.email!,
                fullName: payload!.name!,
              };

              return User.create(userData).then((user: IUser) => {
                return createTokens(user)
                  .then((tokens) => {
                    return res.json({
                      ...tokens,
                      userId: user._id,
                      email: user.email,
                    });
                  })
                  .catch((err) => {
                    console.log('1', err);
                    
                    return res.status(500).json({ message: "Server error" });
                  });
              });
            }
            createTokens(user)
              .then((tokens) => {
                res.json({
                  ...tokens,
                  userId: user._id,
                  email: user.email,
                });
              })
              .catch((err) => {
                console.log('1', err);
                res.status(500).json({ message: "Server error" });
              });
          })
          .catch((err) => {
            console.log('1', err);
            res.status(500).json({ message: "Server error" });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "Nieprawidłowy token" });
      });
  } else {
    return res
      .status(400)
      .json({ message: "Nieprawidłowy dostawca tożsamości" });
  }
};

export default {
  login,
  register,
  refreshToken,
  revokeToken,
  loginWithProvider,
};
