import { Request, Response } from "express";
import Debug from "debug";
import { Movie } from "./movie.model";

const debug = Debug("lmdb:movie.controller");

/**
 * Get all movies
 */

export const index = async (req: Request, res: Response) => {
  try {
    // Find all movies
    const movies = await Movie.find({}).sort({ title: 1 });
    res.send({
      status: "success",
      data: movies,
    });
  } catch (err) {
    debug("Error thrown when finding movies", err);
    res
      .status(500)
      .send({ status: "error", message: "Error thrown when finding movies" });
  }
};

export const show = async (req: Request, res: Response) => {
  const movieId = req.params.movieId;

  try {
    // Find a single movie
    const movie = await Movie.findById(movieId);

    if (!movie) {
      res.status(404).send({ status: "fail", message: "Movie does not exist" });
      return;
    }

    res.send({
      status: "success",
      data: movie,
    });
  } catch (err) {
    debug("Error thrown when finding movie", err);
    res
      .status(500)
      .send({ status: "error", message: "Error thrown when finding movie" });
  }
};
