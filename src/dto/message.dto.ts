import { Schema } from "express-validator";
import { TRIGGER_TYPE } from "../enums/triggerType.enum";

export const messageDto: Schema = {
  triggerType: {
    in: ["body"],
    isIn: {
      options: [Object.values(TRIGGER_TYPE)],
      errorMessage: "Nieprawidłowy wyzwalacz",
    },
    isEmpty: {
      negated: true,
      errorMessage: "Wybierz typ wyzwalacza",
    },
  },
  triggerDate: {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "Nieprawidłowy format daty",
    }
  },
  afterInactivity: {
    in: ["body"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Podaj poprawną liczbę dni",
    }
  },
  phoneNumber: {
    in: ["body"],
    optional: true,
    isMobilePhone: {
      errorMessage: "Nieprawidłowy format numeru telefonu",
    }
  },
  smsMessage: {
    in: ["body"],
    optional: true,
  },
  email: {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Nieprawidłowy format adresu email",
    }
  },
  emailMessage: {
    in: ["body"],
    optional: true,
  },
};
