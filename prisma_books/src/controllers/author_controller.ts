// Author controller
import Debug from "debug";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../prisma";
import {
  deleteAuthor,
  getAuthor,
  getAuthors,
} from "../services/author_service";

// Create a new debug instance
const debug = Debug("prisma-books:author_controller");
/**
 * Get all authors
 */
export const index = async (req: Request, res: Response) => {
  try {
    const authors = await getAuthors();
    res.send({
      status: "success",
      data: authors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when querying the database",
    });
  }
};

/**
 * Get a single author
 */
export const show = async (req: Request, res: Response) => {
  const authorId = Number(req.params.authorId);

  try {
    const author = await getAuthor(authorId);
    res.send({
      status: "success",
      data: author,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      // debug("Author with ID %d could not be found: %O", authorId, err);
      res.status(404).send({ status: "error", message: "Author Not Found" });
    } else {
      debug(
        "Error when trying to query for Author with ID %d: %O",
        authorId,
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
 * Create a author
 */
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

  try {
    const author = await prisma.author.create({
      data: req.body,
    });
    res.status(201).send(author);
  } catch (err) {
    debug("Error when trying to create a new author: %O", err);
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when creating the record in the database",
    });
  }
};

/**
 * Update a author
 */
export const update = async (req: Request, res: Response) => {
  const authorId = Number(req.params.authorId);

  try {
    const author = await prisma.author.update({
      where: {
        id: authorId,
      },
      data: req.body,
    });
    res.send({
      status: "success",
      data: author,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      debug("Error when trying to update author with ID %d: %O", authorId, err);
      // console.log(err);
      res.status(404).send({ status: "error", message: "Author Not Found" });
    } else {
      console.error(err);
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};

/**
 * Delete a author
 */
export const destroy = async (req: Request, res: Response) => {
  const authorId = Number(req.params.authorId);

  try {
    await deleteAuthor(authorId);
    res.send({ status: "success", data: {} });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      debug("Error when trying to delete Book with ID %d: %O", authorId, err);
      // console.log(err);
      res.status(404).send({ status: "error", message: "Author Not Found" });
    } else {
      console.error(err);
      res.status(500).send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
    }
  }
};
