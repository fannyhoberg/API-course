import express from "express";
import prisma from "../prisma";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/publisher_controller";
const router = express.Router();

/**
 * GET /publisher
 *
 * Get all publisher
 */
router.get("/", index);

/**
 * GET /publishers/:id
 *
 * Get specific book
 */
router.get("/:publisherId", show);

/**

* POST /publishers
*
* Post all publishers
*/
router.post("/", store);

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
router.patch("/:publisherId", update);

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
router.delete("/:publisherId", destroy);

export default router;
