/**
 * Validation rules for user resource
 */
import { body } from "express-validator";

export const createUserRules = [
  body("name")
    .isString()
    .withMessage("name has to be a string")
    .bail()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name has to be at least 3 chars long"),
  body("email").trim().isEmail().withMessage("email has to be a valid email"),
  body("password")
    .isString()
    .withMessage("password has to be a string")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password has to be at least 6 chars long")
    .trim(),
];
