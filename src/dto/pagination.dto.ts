import { Schema } from "express-validator";

export const paginationDto: Schema = {
  pageSize: {
    in: ['query'],
    isInt: {
      options: { min: 1, max: 100 },
    },
    optional: true,
    errorMessage: 'Podaj poprawny rozmiar strony',
  },
  pageNumber: {
    in: ['query'],
    isInt: {
      options: { min: 1 },
    },
    optional: true,
    errorMessage: 'Podaj poprawny numer strony',
  }
}