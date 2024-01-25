/**
 * Register Controller
 */
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../prisma";
import Debug from "debug";

const debug = Debug("prisma-books:book_controller");

/**
 * Register a new user
 *
 * @todo validate incoming data and bail if validation fails
 */
export const register = async (req: Request, res: Response) => {
  // Validate incoming data
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send({
      status: "fail",
      data: validationErrors.array(),
    });
    return;
  }

  // Calculate a hash + salt for the password

  // Store the user in the database

  // Respond with 201 Created + status success
  res.status(201).send({ status: "success", data: req.body });
};
