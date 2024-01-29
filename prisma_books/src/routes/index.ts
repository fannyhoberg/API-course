import express from "express";
import authorRoutes from "./authors";
import bookRoutes from "./books";
import publisherRoutes from "./publishers";
import profileRoutes from "./profile";
import { register } from "../controllers/register_controller";
import { createUserRules } from "../validations/user_rules";
import { basic } from "../middlewares/auth/basic";

const router = express.Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
  res.send({
    message: "I AM API, BEEP BOOP",
  });
});

// lägger till en sökväg så den inte ska behöva kolla alla routes, utan endast den vi vill nå
router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/publishers", publisherRoutes);

// POST register
router.post("/register", createUserRules, register);

/**
 * /profile
 *
 */

router.use("/profile", basic, profileRoutes);

/**
 * Catch-all route handler
 */
router.use((req, res) => {
  // Respond with 404 and a message in JSON-format
  res.status(404).send({
    message: "Not Found",
  });
});

export default router;
