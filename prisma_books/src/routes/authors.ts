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
router.post(
  "/",
  [
    body("name")
      .isString()
      .withMessage("has to be a string")
      .bail()
      .isLength({ min: 3, max: 191 })
      .withMessage("has to be 3-191 chars long"),
    body("birthyear").optional().isInt().withMessage("has to be an integer"),
  ],
  store
);

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
