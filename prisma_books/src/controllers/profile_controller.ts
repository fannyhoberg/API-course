/**
 * Profile Controller
 */
import Debug from "debug";
import { Request, Response } from "express";
import { addUserToBook, getUserBooks } from "../services/user_service";

// Create a new debug instance
const debug = Debug("prisma-books:profile_controller");

/**
 * Get the authenticated user's profile
 */
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error(
      "Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬"
    );
  }

  // 🤷🏼‍♂️
  debug("User: %O", req.user); //req.user är den inloggade användaren

  res.send({
    status: "success",
    data: req.user,
  });
};

/**
 * Get the authenticated user's books
 */
export const getBooks = async (req: Request, res: Response) => {
  const books = await getUserBooks(req.user.id);
  res.send({
    status: "success",
    data: books,
  });
};

/**
 *  Add books to user
 *
 */
export const addBooks = async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  try {
    const user = await addUserToBook(userId, req.body);
    res.status(201).send({ status: "success", data: user });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      res
        .status(404)
        .send({ status: "error", message: "Book or Author Not Found" });
    } else {
      debug(
        "Error when trying to add Authors %o to Book with ID %d: %O",
        req.body,
        userId,
        err
      );
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};
