import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { title, author, coverImage, pages } = await req.json();

    // Ensure each page has both image and audio
    const formattedPages = pages.map((page: any) => ({
      imageUrl: page.imageUrl,
      audioUrl: page.audioUrl || "", // Ensure audioUrl exists, even if empty
    }));

    const newBook = await Book.create({ title, author, coverImage, pages: formattedPages });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding book:", error);
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
  