import { model, Schema, Document } from "mongoose";
import { PersonDocument } from "../person/person.model";

// includes everything from interface MovieDocument and also from imported Document (from Mongoose, tex _id)
// this is for developers, so we can use Typscript
export interface MovieDocument extends Document {
  title: string;
  runtime: number | null;
  release_year?: number;
  genres: string[];
  watched: Date;
  director?: PersonDocument["_id"];
}

// Schema for mongoose, same as interface but we have to use mongoose structure
// if we need to add keys to schema we have to update interface also
const MovieSchema: Schema = new Schema<MovieDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  runtime: {
    type: Number,
    // min: 1,
    default: null,
    validate(value: number) {
      if (value < 1 && value !== null) {
        throw new Error(
          "Just because you thought the movie was bad, it shouldn't have zero or negative runtime"
        );
      }
    },
  },
  release_year: {
    type: Number,
    min: 1895,
    max: new Date().getFullYear(),
  },
  genres: {
    type: [String],
    lowercase: true,
    default: [],
    // enums: ["action", "sci-fi", "romance", "realism"]
  },
  watched: {
    type: Date,
    default() {
      return Date.now();
    },
  },
  director: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
});

export const Movie = model<MovieDocument>("Movie", MovieSchema);
