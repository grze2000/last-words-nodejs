import { Schema } from "express-validator";

export const tokenDto: Schema = {
  token: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Token not found',
  },
}