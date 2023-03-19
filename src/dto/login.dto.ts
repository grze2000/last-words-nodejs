import { Schema } from "express-validator";

export const loginDto: Schema = {
  email: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Podaj email',
  },
  password: {
    in: ['body'],
    isEmpty: {
      negated: true,
    },
    errorMessage: 'Podaj hasło',
  }
}