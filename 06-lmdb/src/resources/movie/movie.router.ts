import express from "express";
import { index } from "./movie.controller";
const router = express.Router();

/** GET /movies
 *
 */
router.get("/", index);

export default router;
