import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true }, // URL of the book cover
  pages: [{ type: String, required: true }], // Array of image URLs for book pages
}, { timestamps: true });

export const Book = models.Book || model("Book", BookSchema);
