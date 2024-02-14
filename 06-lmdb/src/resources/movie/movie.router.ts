import express from "express";
import { destroy, index, show, store, update } from "./movie.controller";
const router = express.Router();

/** GET /movies
 *
 */
router.get("/", index);

/**
 * GET /movies/:movieId
 */
router.get("/:movieId", show);

/**
 * POST /movies
 */
router.post("/", store);

/**
 * PATCH /movies
 */
router.patch("/:movieId", update);

/**
 * DELETE /movies
 */
router.delete("/:movieId", destroy);

export default router;
