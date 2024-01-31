import { body } from "express-validator";

export const createAuthorRules = [
  body("name")
    .isString()
    .withMessage("has to be a string")
    .bail()
    .isLength({ min: 3, max: 191 })
    .withMessage("has to be 3-191 chars long"),
  body("birthyear")
    .optional()
    .isInt({ max: new Date().getFullYear() })
    .withMessage("has to be an integer"),
];

export const updateAuthorRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("name has to be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 191 })
    .withMessage("name has to be 3-191 chars"),
  body("birthyear")
    .optional()
    .isInt({ max: new Date().getFullYear() })
    .withMessage("has to be a year (current or past)"),
];
