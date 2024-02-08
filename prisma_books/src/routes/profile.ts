import express from "express";
import {
  addBooks,
  getBooks,
  getProfile,
} from "../controllers/profile_controller";
import { deleteBook } from "../services/book_service";
const router = express.Router();

/**
 * GET /profile
 *
 * Get the authenticated user's profile
 */
router.get("/", getProfile);

/**
 * GET /profile/books
 *
 * Get the authenticated user's books
 */
router.get("/books", getBooks);

/**
 * POST /profile/books
 *
 * Add books to Profile
 */
router.post("/books", addBooks);

/**
 * PATCH /profile/books
 *
 * Update Profile
 */
// router.patch("/", updateProfile)

/**
 * DELETE /books/:userId
 *
 * Unlink a book from a user
 */
router.delete("/books/:bookId", deleteBook);

export default router;
