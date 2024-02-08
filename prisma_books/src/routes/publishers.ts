import express from "express";
import prisma from "../prisma";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/publisher_controller";
import {
  createPublisherRules,
  updatePublisherRules,
} from "../validations/publisher_rules";
import { validateRequest } from "../middlewares/validate_request";
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
router.post("/", createPublisherRules, validateRequest, store);

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
router.patch("/:publisherId", updatePublisherRules, validateRequest, update);

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
router.delete("/:publisherId", destroy);

export default router;
