import { body } from "express-validator";

export const createAuthorRules = [
  body("name")
    .isString()
    .withMessage("has to be a string")
    .bail()
    .isLength({ min: 3, max: 191 })
    .withMessage("has to be 3-191 chars long"),
  body("birthyear").optional().isInt().withMessage("has to be an integer"),
];
