import express from "express";
import { index, show, store, update } from "./movie.controller";
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

export default router;
