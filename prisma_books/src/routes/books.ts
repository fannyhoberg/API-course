import express from "express";
import prisma from "../prisma";
import {
  index,
  show,
  store,
  update,
  destroy,
  addAuthor,
  removeAuthor,
} from "../controllers/book_controller";
import { createBookRules, updateBookRules } from "../validations/book_rules";
import { validateRequest } from "../middlewares/validate_request";
const router = express.Router();

/**
 * GET /books
 *
 * Get all books
 */
router.get("/", index);

/**
 * GET /books/:id
 *
 * Get specific book
 */
router.get("/:bookId", show);

/**
 * POST /book
 *
 * Create an book
 */
router.post("/", createBookRules, validateRequest, store);

// Update info on book
router.patch("/:bookId", updateBookRules, validateRequest, update);

// Delete book

router.delete("/:bookId", destroy);

/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 *
 * Vi skickar in vilket author id som ska kopplas på till den boken vi postar till
 */
router.post("/:bookId/authors", addAuthor);

/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
router.delete("/:bookId/authors/:authorId", removeAuthor);

export default router;
