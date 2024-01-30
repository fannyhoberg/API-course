import express from "express";
import { body } from "express-validator";
// import prisma from "../prisma";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/author_controller";
import { createAuthorRules } from "../validations/author_rules";
const router = express.Router();

/**
 * GET /authors
 *
 * Get all authors
 */
router.get("/", index);

/**
 * GET /authors/:id
 *
 * Get specific author
 */
router.get("/:authorId", show);

/**
 * POST /author
 *
 * Create an author
 */
router.post("/", createAuthorRules, store);

/**
 * PATCH /author
 *
 * Update an author
 */
router.patch("/:authorId", update);

/**
 * DELETE /author
 *
 * Delete an author
 */
router.delete("/:authorId", destroy);

export default router;
