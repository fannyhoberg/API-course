import express from "express";
import prisma from "../prisma";
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
router.post("/", store);

// Update info on author
router.patch("/:authorId", update);

router.delete("/:authorId", destroy);

export default router;
