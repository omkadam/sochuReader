import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true }, // URL of the book cover
    pages: [
      {
        imageUrl: { type: String, required: true },
        audioUrl: { type: String, required: true }, // New field for audio URL
      },
    ], // Array of objects containing image & audio URLs
  },
  { timestamps: true }
);

export const Book = models.Book || model("Book", BookSchema);

