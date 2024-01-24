import express from "express";
import prisma from "../prisma";
const router = express.Router();

/**
 * GET /books
 *
 * Get all books
 */
router.get("/", async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.send(books);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Something went wrong when querying the database" });
  }
});

/**
 * GET /books/:id
 *
 * Get specific book
 */
router.get("/:bookId", async (req, res) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await prisma.book.findUniqueOrThrow({
      where: {
        id: bookId,
      },
      include: {
        authors: true,
      },
    });
    res.send(book);
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      console.log(err);
      res.status(404).send({ message: "Book Not Found" });
    } else {
      console.error(err);
      res
        .status(500)
        .send({ message: "Something went wrong when querying the database" });
    }
  }
});

/**
 * POST /book
 *
 * Create an book
 */
router.post("/", async (req, res) => {
  try {
    const book = await prisma.book.create({
      data: req.body,
    });
    res.status(201).send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong when creating the record in the database",
    });
  }
});

// Update info on book
router.patch("/:bookId", async (req, res) => {
  const bookId = Number(req.params.bookId);

  try {
    const updateBook = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: req.body,
    });
    res.status(200).send(updateBook);
  } catch {
    res.status(500).send({
      message: "Something went wrong when updating the record in the database",
    });
  }
});

// Delete book

router.delete("/:bookId", async (req, res) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await prisma.book.delete({
      where: {
        id: bookId,
      },
    });
    res.status(200).send({
      status: "success",
      message: "Deleted author",
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong when deleting the record in the database",
    });
  }
});

/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 *
 * Vi skickar in vilket author id som ska kopplas på till den boken vi postar till
 */
router.post("/:bookId/authors", async (req, res) => {
  const bookId = Number(req.params.bookId);

  try {
    const book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        authors: {
          connect: req.body,
        },
      },
      include: {
        authors: true,
      },
    });
    res.status(201).send(book);
  } catch {
    res.status(500).send({
      message: "Something went wrong when updating the record in the database",
    });
  }
});

/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
router.delete("/:bookId/authors/:authorId", async (req, res) => {
  const bookId = Number(req.params.bookId);
  const authorId = Number(req.params.authorId);

  try {
    const book = await prisma.book.update({
      where: {
        id: bookId, // leta upp boken där vi vill ta bort en författare
      },
      data: {
        authors: {
          disconnect: {
            id: authorId, // på det bookId - disconnect (ta bort link) authorId
          },
        },
      },
      include: {
        authors: true,
      },
    });
    res.status(201).send(book);
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      console.log(err);
      res.status(404).send({ message: "Book Not Found" });
    } else {
      console.error(err);
      res
        .status(500)
        .send({ message: "Something went wrong when querying the database" });
    }
  }
});

export default router;
