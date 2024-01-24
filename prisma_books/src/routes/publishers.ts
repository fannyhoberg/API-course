import express from "express";
import prisma from "../prisma";
const router = express.Router();

/**
 * GET /publisher
 *
 * Get all publisher
 */
router.get("/", async (req, res) => {
  try {
    const publishers = await prisma.publisher.findMany();
    res.send(publishers);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Something went wrong when querying the database" });
  }
});

/**
 * GET /publishers/:id
 *
 * Get specific book
 */
router.get("/:publisherId", async (req, res) => {
  const publisherId = Number(req.params.publisherId);

  try {
    const publisher = await prisma.publisher.findUniqueOrThrow({
      where: {
        id: publisherId,
      },
      include: {
        books: true,
      },
    });
    res.send(publisher);
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

* POST /publishers
*
* Post all publishers
*/
router.post("/", async (req, res) => {
  try {
    const publisher = await prisma.publisher.create({
      data: req.body,
    });
    res.status(201).send(publisher);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong when creating the record in the database",
    });
  }
});

/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 *
 * Vi skickar in vilket author id som ska kopplas på till den boken vi postar
 */
router.post("/:publisherId/books", async (req, res) => {
  const publisherId = Number(req.params.publisherId);

  try {
    const publisher = await prisma.publisher.update({
      where: {
        id: publisherId,
      },
      data: {
        books: {
          connect: req.body,
        },
      },
      include: {
        books: true,
      },
    });
    res.status(201).send(publisher);
  } catch {
    res.status(500).send({
      message: "Something went wrong when updating the record in the database",
    });
  }
});

export default router;
