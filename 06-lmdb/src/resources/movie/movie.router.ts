import express from "express";
import { index, show, store } from "./movie.controller";
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

export default router;
