"use client";

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import { X, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";

interface Page {
  imageUrl: string;
  audioUrl: string;
}

interface Book {
  _id: string;
  title: string;
  pages: Page[]; // Update type definition
}

const BookReader = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch("/api/books");
        const books = await res.json();
        console.log("📜 Book Data:", books);

        if (books.length > 0 && books[0]?.pages?.length > 0) {
          setBook(books[0]); // Load the first book
        } else {
          console.error("❌ No valid pages found in API response");
        }
      } catch (error) {
        console.error("❌ Error fetching book:", error);
      }
    };

    fetchBook();
  }, []);

  useEffect(() => {
    if (book && book.pages[currentPage]?.audioUrl) {
      const newAudio = new Audio(book.pages[currentPage].audioUrl);
      setAudio(newAudio);
      setIsPlaying(false);
    }
  }, [currentPage, book]);

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentPage((prev) =>
        book?.pages?.length ? Math.min(prev + 1, book.pages.length - 1) : 0
      ),
    onSwipedRight: () => setCurrentPage((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  if (!book || !book.pages || book.pages.length === 0)
    return <p className="text-white text-center">📖 No pages available</p>;

  return (
    <div
      {...handlers}
      className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Close Button */}
      <button
        className="absolute top-3 left-4 bg-none text-white p-2 rounded-full z-50 md:top-4 md:left-4 md:p-2"
        onClick={() => router.back()}
      >
        <X size={24} />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-14 left-4 right-4 h-3 bg-white rounded-full overflow-hidden z-40">
        <div
          className="h-full bg-green-500 transition-all rounded-full"
          style={{
            width: `${book.pages.length > 0 ? ((currentPage + 1) / book.pages.length) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Book Image */}
      {book.pages[currentPage]?.imageUrl ? (
        <Image
          src={book.pages[currentPage].imageUrl}
          alt={`Page ${currentPage + 1}`}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <p className="text-white">❌ Image Not Found</p>
      )}

      {/* Audio Button */}
      {book.pages[currentPage]?.audioUrl && (
        <button
          className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-50"
          onClick={toggleAudio}
        >
          {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}
    </div>
  );
};

export default BookReader;
