import express from "express";
import authorRoutes from "./authors";
import bookRoutes from "./books";
import publisherRoutes from "./publishers";
import { register } from "../controllers/register_controller";
import { body } from "express-validator";

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
router.post(
  "/register",
  [
    body("name")
      .isString()
      .withMessage("name has to be a string")
      .bail()
      .trim()
      .isLength({ min: 3 })
      .withMessage("name has to be at least 3 chars long"),
    body("email").trim().isEmail().withMessage("email has to be a valid email"),
    body("password")
      .isString()
      .withMessage("password has to be a string")
      .bail()
      .isLength({ min: 6 })
      .withMessage("password has to be at least 6 chars long")
      .trim(),
  ],
  register
);

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
