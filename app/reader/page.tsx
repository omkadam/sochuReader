"use client";

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  pages: string[];
}

const BookReader = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch("/api/books");
      const books = await res.json();
      if (books.length > 0) {
        setBook(books[0]); // Load the first book
      }
    };
    fetchBook();
  }, []);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentPage((prev) =>
        book?.pages?.length ? Math.min(prev + 1, book.pages.length - 1) : prev
      ),
    onSwipedRight: () =>
      setCurrentPage((prev) => (book?.pages?.length ? Math.max(prev - 1, 0) : prev)),
    trackMouse: true,
  });

  if (!book) return <p className="text-white text-center">Loading...</p>;

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
        <X size={24} className="md:size-24" />
      </button>

      {/* Progress Bar (Now Bigger & Debugging with Red Background) */}
      {/* <div className="fixed top-0 left-0 w-full h-4 bg-gray-800 z-50">
        <div
          className="h-full bg-green-500 transition-all"
          style={{
            width: `${book?.pages?.length ? ((currentPage + 1) / book.pages.length) * 100 : 0}%`,
          }}
        />
      </div> */}
      {/* Progress Bar */}
      <div className="absolute top-14 left-4 right-4 h-3 bg-white rounded-full overflow-hidden z-40">
        <div
          className="h-full bg-green-500 transition-all rounded-full"
          style={{
            width: `${book?.pages?.length ? ((currentPage + 1) / book.pages.length) * 100 : 0}%`,
          }}
        />
      </div>


      {/* Book Image */}
      {book.pages.length > 0 && (
        <Image
          src={book.pages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          fill
          className="object-cover"
          priority
        />
      )}
    </div>
  );
};

export default BookReader;
