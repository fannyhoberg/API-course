import { model, Schema, Document } from "mongoose";

// includes everything from interface MovieDocument and also from imported Document (from Mongoose, tex _id)
// this is for developers, so we can use Typscript
export interface MovieDocument extends Document {
  title: string;
  runtime?: number;
  release_year?: number;
}

// Schema for mongoose, same as interface but we have to use mongoose structure
// if we need to add keys to schema we have to update interface also
const MovieSchema: Schema = new Schema<MovieDocument>({
  title: String,
  runtime: Number,
  release_year: Number,
});

export const Movie = model<MovieDocument>("Movie", MovieSchema);
