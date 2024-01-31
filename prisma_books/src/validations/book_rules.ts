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
    .isInt({ min: 1 })
    .withMessage("Pages has to be an integer")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Pages has to be atleast 3 chars long"),
];

export const updateBookRules = [
  body("title")
    .optional()
    .isString()
    .withMessage("title has to be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 191 })
    .withMessage("title has to be 3-191 chars"),
  body("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("has to be a positive integer"),
  body("publisherId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("has to be a positive integer"),
];
