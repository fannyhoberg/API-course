import express from "express";
import morgan from "morgan";
import authorRoutes from "./routes/authors";
import bookRoutes from "./routes/books";
import publisherRoutes from "./routes/publishers";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// use routes
app.use(authorRoutes);
app.use(bookRoutes);
app.use(publisherRoutes);

/**
 * GET /
 */
app.get("/", (req, res) => {
  res.send({
    message: "I AM API, BEEP BOOP",
  });
});

/**
 * Catch-all route handler
 */
app.use((req, res) => {
  // Respond with 404 and a message in JSON-format
  res.status(404).send({
    message: "Not Found",
  });
});

export default app;
