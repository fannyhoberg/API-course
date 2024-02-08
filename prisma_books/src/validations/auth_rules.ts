import { body } from "express-validator";

export const loginRules = [
  // email required + valid email (+ unique)
  body("email").trim().isEmail().withMessage("email has to be a valid email"),
  // password required + trimmed + at least 6 chars
  body("password")
    .isString()
    .withMessage("password has to be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("password cannot be empty"),
];
