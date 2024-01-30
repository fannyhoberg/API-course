import { body } from "express-validator";

export const createBookRules = [
  body("title")
    .isString()
    .withMessage("Title has to be a string")
    .bail()
    .isLength({ min: 3, max: 191 })
    .withMessage("Title has to be 3-191 chars long"),
  body("pages")
    .optional()
    .isInt()
    .withMessage("Pages has to be an integer")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Pages has to be atleast 3 chars long"),
];
