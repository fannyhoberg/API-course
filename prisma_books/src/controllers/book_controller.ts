import Debug from "debug";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import prisma from "../prisma";
import {
  addAuthorToBook,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  removeAuthorFromBook,
  updateBook,
} from "../services/book_service";
import { CreateBook } from "../types/Book_types";

// Create a new debug instance
const debug = Debug("prisma-books:book_controller");

export const index = async (req: Request, res: Response) => {
  try {
    const books = await getBooks();
    res.send({
      status: "success",
      data: books,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when querying the database",
    });
  }
};

export const show = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await getBook(bookId);
    res.send({
      status: "success",
      data: book,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      // debug("Book with ID %d could not be found: %O", bookId, err);
      // console.log(err);
      res.status(404).send({ status: "error", message: "Book Not Found" });
    } else {
      // console.error(err);
      debug("Error when trying to query for Book with ID %d: %O", bookId, err);
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};

export const store = async (req: Request, res: Response) => {
  // Check for any validation errors
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send({
      status: "fail",
      data: validationErrors.array(),
    });
    return;
  }

  const validatedData = matchedData(req) as CreateBook;

  try {
    const book = await createBook(validatedData);
    res.status(201).send({
      status: "success",
      data: book,
    });
  } catch (err) {
    // console.error(err);
    debug("Error when trying to create a new Book: %O", err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when creating the record in the database",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await updateBook(bookId, req.body);
    res.status(200).send({
      status: "success",
      data: book,
    });
  } catch (err) {
    debug("Error when trying to update Book with ID %d: %O", bookId, err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when updating the record in the database",
    });
  }
};

export const destroy = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId);

  try {
    await deleteBook(bookId);
    res.status(200).send({ status: "success", data: {} });
  } catch (err) {
    debug("Error when trying to delete Book with ID %d: %O", bookId, err);
    // console.error(err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when deleting the record in the database",
    });
  }
};

/**
 * Link book to author(s)
 */
export const addAuthor = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await addAuthorToBook(bookId, req.body);
    res.status(201).send({ status: "success", data: book });
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
        bookId,
        err
      );
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};

/**
 * Unlink an author from a book
 */
export const removeAuthor = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId);
  const authorId = Number(req.params.authorId);

  try {
    const book = await removeAuthorFromBook(bookId, authorId);
    res.status(200).send({ status: "success", data: book });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      res.status(404).send({ status: "error", message: "Book Not Found" });
    } else {
      debug(
        "Error when trying to remove Author %d to Book with ID %d: %O",
        authorId,
        bookId,
        err
      );
      console.error(err);
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};
