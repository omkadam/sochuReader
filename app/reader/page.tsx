"use client";

import { useEffect, useRef, useState } from "react";
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
  pages: Page[]; // Updated to use imageUrl & audioUrl
}

const BookReader = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Fetch Book Data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch("/api/books");
        const books = await res.json();
        console.log("📜 Book Data:", books);
    
        if (books.length > 0 && books[0]?.pages?.length > 0) {
          setBook(books[0]); // Correct format
        } else {
          console.error("❌ No valid pages found in API response");
        }
      } catch (error) {
        console.error("❌ Error fetching book:", error);
      }
    };

    fetchBook();
  }, []);

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isPlaying) {
        setCurrentPage((prev) =>
          book?.pages?.length ? Math.min(prev + 1, book.pages.length - 1) : 0
        );
      }
    },
    onSwipedRight: () => {
      if (!isPlaying) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    },
    trackMouse: true,
  });

  // Play/Pause audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // When audio ends, allow swipe again
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [currentPage]); // Run this every time the page changes

  if (!book || !book.pages || book.pages.length === 0)
    return <p className="text-white text-center">📖 No pages available</p>;

  return (
    <div
      {...handlers}
      className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Close Button */}
      <button
        className="absolute top-4 left-4 text-white p-2 rounded-full z-50"
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

      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={book.pages[currentPage]?.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play/Pause Button */}
      <button
    onClick={toggleAudio}
    className="fixed bottom-8 right-8 bg-white p-2 rounded-full z-50"
>
    {isPlaying ? <VolumeX size={36} /> : <Volume2 size={36} />}
</button>
    </div>
  );
};

export default BookReader;
