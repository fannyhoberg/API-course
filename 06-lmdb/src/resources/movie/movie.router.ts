import express from "express";
import { index, show } from "./movie.controller";
const router = express.Router();

/** GET /movies
 *
 */
router.get("/", index);

/**
 * GET /movies/:movieId
 */
router.get("/:movieId", show);

export default router;
