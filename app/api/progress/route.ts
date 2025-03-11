import { connectToDatabase } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import { NextResponse } from "next/server";

// GET user progress
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const bookId = searchParams.get("bookId");

  if (!userId || !bookId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await connectToDatabase();
  const progress = await Progress.findOne({ userId, bookId });

  return NextResponse.json({ progress: progress?.progress || 0 });
}

// POST to update user progress
export async function POST(req: Request) {
  const { userId, bookId, progress } = await req.json();

  if (!userId || !bookId || progress === undefined) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await connectToDatabase();
  await Progress.findOneAndUpdate(
    { userId, bookId },
    { userId, bookId, progress },
    { upsert: true, new: true }
  );

  return NextResponse.json({ message: "Progress saved" });
}
