import express from "express";
import authorRoutes from "./authors";
import bookRoutes from "./books";
import publisherRoutes from "./publishers";
import profileRoutes from "./profile";
import { login, refresh, register } from "../controllers/user_controller";
import { createUserRules } from "../validations/user_rules";
import { validateAccessToken } from "../middlewares/auth/jwt";
import { loginRules } from "../validations/auth_rules";
import { validateRequest } from "../middlewares/validate_request";

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

/**
 * POST /login
 *
 * Log in a user.
 */
router.post("/login", loginRules, validateRequest, login);

/**
 * POST /refresh
 *
 * Refresh token.
 */
router.post("/refresh", refresh);

/**
 * POST /register
 *
 * Register a new user.
 */
router.post("/register", createUserRules, validateRequest, register);

/**
 * /profile
 *
 */

router.use("/profile", validateAccessToken, profileRoutes);

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
