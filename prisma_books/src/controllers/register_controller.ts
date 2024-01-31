/**
 * Register Controller
 */
import bcrypt from "bcrypt";
import Debug from "debug";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import prisma from "../prisma";
import { createUser } from "../services/user_service";
import { CreateUser } from "../types/User_types";

// Create a new debug instance
const debug = Debug("prisma-books:register_controller");

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

  // Get only the validated data from the request
  const validatedData = matchedData(req);
  debug("validatedData: %O", validatedData);

  // Calculate a hash + salt for the password
  const hashed_password = await bcrypt.hash(validatedData.password, 10);
  debug("plaintext password:", validatedData.password);
  debug("hashed password:", hashed_password);

  const data = {
    ...validatedData,
    password: hashed_password,
  } as CreateUser;

  // Store the user in the database
  try {
    const user = await createUser(data);

    // Respond with 201 Created + status success
    res.status(201).send({ status: "success", data: user });
  } catch (err) {
    debug("Error when trying to create User: %O", err);
    return res
      .status(500)
      .send({ status: "error", message: "Could not create user in database" });
  }
};
