import { Request, Response } from "express";
import prisma from "../prisma";

export const index = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany();
    res.send(books);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Something went wrong when querying the database" });
  }
};

export const show = async (req: Request, res: Response) => {
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
};

export const store = async (req: Request, res: Response) => {
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
};

export const update = async (req: Request, res: Response) => {
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
};

export const destroy = async (req: Request, res: Response) => {
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
};

/**
 * Link book to author(s)
 */
export const addAuthor = async (req: Request, res: Response) => {
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
};

/*
 * Unlink an author from a book
 */
export const removeAuthor = async (req: Request, res: Response) => {
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
};
