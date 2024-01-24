import express from "express";
import prisma from "../prisma";
const router = express.Router();

/**
 * GET /authors
 *
 * Get all authors
 */
router.get("/", async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.send(authors);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Something went wrong when querying the database" });
  }
});

/**
 * GET /authors/:id
 *
 * Get specific author
 */
router.get("/:authorId", async (req, res) => {
  const authorId = Number(req.params.authorId);

  try {
    const author = await prisma.author.findUniqueOrThrow({
      where: {
        id: authorId,
      },
      include: {
        books: true,
      },
    });
    res.send(author);
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      console.log(err);
      res.status(404).send({ message: "Author Not Found" });
    } else {
      console.error(err);
      res
        .status(500)
        .send({ message: "Something went wrong when querying the database" });
    }
  }
});

/**
 * POST /author
 *
 * Create an author
 */
router.post("/", async (req, res) => {
  try {
    const author = await prisma.author.create({
      data: req.body,
    });
    res.status(201).send(author);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong when creating the record in the database",
    });
  }
});

// Update info on author
router.patch("/:authorId", async (req, res) => {
  const authorId = Number(req.params.authorId);

  try {
    const updateAuthor = await prisma.author.update({
      where: {
        id: authorId,
      },
      data: req.body,
    });
    res.status(200).send(updateAuthor);
  } catch {
    res.status(500).send({
      message: "Something went wrong when updating the record in the database",
    });
  }
});

router.delete("/:authorId", async (req, res) => {
  const authorId = Number(req.params.authorId);

  try {
    const author = await prisma.author.delete({
      where: {
        id: authorId,
      },
    });
    res.status(200).send({
      status: "success",
      message: "Deleted author",
      data: author,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong when deleting the record in the database",
    });
  }
});

export default router;
