import express from "express";
import * as personController from "./person.controller";
const router = express.Router();

/**
 * GET /people
 */
router.get("/", personController.index);

/**
 * GET /people/:personId
 */
router.get("/:personId", personController.show);

/**
 * PATCH /people/:personId
 */
router.patch("/:personId", personController.update);

/**
 * POST /people
 */
router.post("/", personController.store);

/**
 * DELETE /people
 */
router.delete("/:personId", personController.destroy);

export default router;
