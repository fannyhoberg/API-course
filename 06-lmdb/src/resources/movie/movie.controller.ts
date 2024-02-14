import { Request, Response } from "express";
import Debug from "debug";
import { Movie } from "./movie.model";
import mongoose from "mongoose";

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

/**
 * Get a single movie
 **/

export const show = async (req: Request, res: Response) => {
  const movieId = req.params.movieId;

  try {
    // Find a single movie and show director (with populate)
    const movie = await Movie.findById(movieId).populate("director", "name");

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

/**
 * Get all movies
 */

export const store = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.create(req.body);

    res.status(201).send({
      status: "success",
      data: movies,
    });
  } catch (err) {
    debug("Error thrown when creating movies", err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
      return;
    }
    res
      .status(500)
      .send({ status: "error", message: "Error thrown when creating movies" });
  }
};

/**
 * Update a movie
 */

export const update = async (req: Request, res: Response) => {
  const movieId = req.params.movieId;
  try {
    const movies = await Movie.findByIdAndUpdate(movieId, req.body);

    res.status(201).send({
      status: "success",
      data: movies,
    });
  } catch (err) {
    debug("Error thrown when updating movie", err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({
        status: "fail",
        message: err.message,
      });
      return;
    }
    res
      .status(500)
      .send({ status: "error", message: "Error thrown when updating movie" });
  }
};
