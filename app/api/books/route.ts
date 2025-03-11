import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { title, author, coverImage, pages } = await req.json();

    const newBook = await Book.create({ title, author, coverImage, pages });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding book" }, { status: 500 });
  }
}

export async function GET() {
    try {
      await connectToDatabase();
      const books = await Book.find();
      return NextResponse.json(books, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Error fetching books" }, { status: 500 });
    }
  }
  