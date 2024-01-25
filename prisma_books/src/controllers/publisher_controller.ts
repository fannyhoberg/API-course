// Publishers controller
import Debug from "debug";

import { Request, Response } from "express";
import prisma from "../prisma";

// Create a new debug instance
const debug = Debug("prisma-books:book_controller");

// Get all publishers
export const index = async (req: Request, res: Response) => {
  try {
    const publishers = await prisma.publisher.findMany();
    res.send({
      status: "success",
      data: publishers,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({
        status: "error",
        message: "Something went wrong when querying the database",
      });
  }
};

export const show = async (req: Request, res: Response) => {
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
    res.send({
      status: "success",
      data: publisher,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      console.log(err);
      res.status(404).send({ status: "error", message: "Publisher Not Found" });
    } else {
      debug(
        "Error when trying to query for publisher with ID %d: %O",
        publisherId,
        err
      );
      // console.error(err);
      res
        .status(500)
        .send({
          status: "error",
          message: "Something went wrong when querying the database",
        });
    }
  }
};

export const store = async (req: Request, res: Response) => {
  try {
    const publisher = await prisma.publisher.create({
      data: req.body,
    });
    res.status(201).send({
      status: "success",
      data: publisher,
    });
  } catch (err) {
    debug("Error when trying to create a new publisher: %O", err);
    // console.error(err);
    res.status(500).send({
      status: "error",
      message: "Something went wrong when creating the record in the database",
    });
  }
};

/**
 * Update a publisher
 */
export const update = async (req: Request, res: Response) => {
  const publisherId = Number(req.params.publisherId);

  try {
    const publisher = await prisma.publisher.update({
      where: {
        id: publisherId,
      },
      data: req.body,
    });
    res.status(200).send({
      status: "success",
      data: publisher,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      debug(
        "Error when trying to update publisher with ID %d: %O",
        publisherId,
        err
      );
      res.status(404).send({ status: "error", message: "Publisher Not Found" });
    } else {
      console.error(err);
      res
        .status(500)
        .send({
          status: "error",
          message: "Something went wrong when querying the database",
        });
    }
  }
};

export const destroy = async (req: Request, res: Response) => {
  // res.status(405).send({ message: "Not Implemented" });
  // return;

  const publisherId = Number(req.params.publisherId);

  try {
    await prisma.publisher.delete({
      where: {
        id: publisherId,
      },
    });
    res.status(200).send({
      status: "success",
      data: {},
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // NotFoundError
      console.log(err);
      res.status(404).send({ status: "error", message: "Publisher Not Found" });
    } else {
      // console.error(err);
      debug(
        "Error when trying to delete Book with ID %d: %O",
        publisherId,
        err
      );

      res
        .status(500)
        .send({
          status: "error",
          message: "Something went wrong when querying the database",
        });
    }
  }
};
