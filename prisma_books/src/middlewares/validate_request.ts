import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * 
Validate incoming requests
 */

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for any validation errors
  const validationErrors = validationResult(req);

  // if validation errors, respond with errors and stop request
  if (!validationErrors.isEmpty()) {
    res.status(400).send({
      status: "fail",
      data: validationErrors.array(),
    });
    return;
  }
  // If no validation errors was found, pass request along
  next();
};
