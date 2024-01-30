import { body } from "express-validator";

export const createPublisherRules = [
  body("name")
    .isString()
    .withMessage("Name has to be a string")
    .bail()
    .isLength({ min: 3, max: 191 })
    .withMessage("Name has to be 3-191 chars long"),
];
