/**
 * Register Controller
 */
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import Debug from "debug";
import { createUser } from "../services/user_service";
import { CreateUser } from "../types/User_types";

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

  debug("req.body: %O", req.body);

  const validatedData = matchedData(req) as CreateUser;
  debug("validatedData: %O", validatedData);

  // Calculate a hash + salt for the password
  const hashed_password = await bcrypt.hash(validatedData.password, 10);
  debug("plaintext password:", validatedData.password);
  debug("hashed password:", hashed_password);

  // Store the user in the database
  try {
    const user = await createUser(validatedData);
    res.status(201).send({
      status: "success",
      data: user,
    });
  } catch (err) {
    // console.error(err);
    debug("Error when trying to create a new user: %O", err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when creating the record in the database",
    });
  }
  // Respond with 201 Created + status success
  //   res.status(201).send({ status: "success", data: req.body });
};
