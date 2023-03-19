import { Schema } from "express-validator";

export const userDto: Schema = {
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
};
