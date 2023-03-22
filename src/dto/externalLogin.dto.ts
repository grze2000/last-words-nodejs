import { Schema } from "express-validator";
import { IDENTIY_PROVIDERS } from "../enums/identityProviders.enum";

export const externalLoginDto: Schema = {
  provider: {
    in: ["body"],
    isIn: {
      options: [Object.values(IDENTIY_PROVIDERS)],
      errorMessage: "Nieprawidłowy dostawca tożsamości",
    },
    isEmpty: {
      negated: true,
      errorMessage: "Nie podano dostawcy uwierzytelniania",
    },
  },
  token: {
    in: ["body"],
    isEmpty: {
      negated: true,
    },
    errorMessage: "Nieprawidłoowy token",
  },
};
