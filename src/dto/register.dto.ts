import { CustomValidator, Schema } from "express-validator";

const notMatchingPasswordValidator: CustomValidator = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Podane hasła nie są identyczne");
  }
  return true;
};

export const registerDto: Schema = {
  fullName: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj imię i nazwisko",
    },
    isAlpha: {
      errorMessage: "Imię i nazwisko może zawierać tylko litery",
      options: [
        "pl-PL",
        {
          ignore: " ",
        },
      ],
    },
  },
  email: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj email",
    },
    isEmail: {
      errorMessage: "Podaj poprawny email",
    },
  },
  password: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj hasło",
    },
    isLength: {
      options: { min: 8, max: 32 },
      errorMessage: "Hasło musi zawierać od 8 do 32 znaków",
    },
  },
  confirmPassword: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Potwierdź hasło",
    },
    custom: {
      options: notMatchingPasswordValidator,
    },
  },
};
