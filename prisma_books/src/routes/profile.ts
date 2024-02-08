import express from "express";
import {
  addBooks,
  getBooks,
  getProfile,
  update,
} from "../controllers/profile_controller";
import { validateRequest } from "../middlewares/validate_request";
import { deleteBook } from "../services/book_service";
import { updateProfileRules } from "../validations/user_rules";
const router = express.Router();

/**
 * GET /profile
 *
 * Get the authenticated user's profile
 */
router.get("/", getProfile);

/**
 * PATCH /profile/books
 *
 * Update Profile
 */
router.patch("/", updateProfileRules, validateRequest, update);

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
 * DELETE /books/:userId
 *
 * Unlink a book from a user
 */
router.delete("/books/:bookId", deleteBook);

export default router;
