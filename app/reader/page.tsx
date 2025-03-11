"use client";

// import { useState } from "react";
// import { useSwipeable } from "react-swipeable";
// import Image from "next/image";
// import { X } from "lucide-react"; // Importing Lucide X icon
// import { useRouter } from "next/navigation"; // For navigation

// const pages = [
//   "/sochu.jpeg",
//   "/sochu2.jpg",
//   "/sochu3.jpg",
//   "/sochu4.jpg",

// ];

// const BookReader = () => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const router = useRouter(); // Use Next.js router for closing

//   const handlers = useSwipeable({
//     onSwipedLeft: () => setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1)),
//     onSwipedRight: () => setCurrentPage((prev) => Math.max(prev - 1, 0)),
//     trackMouse: true,
//   });

//   return (
//     <div 
//       {...handlers} 
//       className="fixed inset-0 w-screen h-screen overflow-hidden touch-none bg-black"
//     >
//       {/* Close Button */}
//       <button 
//         onClick={() => router.back()} 
//         className="absolute top-4 left-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
//       >
//         <X size={24} />
//       </button>

//       <Image 
//         src={pages[currentPage]} 
//         alt={`Book Page ${currentPage + 1}`} 
//         fill 
//         className="object-cover"
//         priority
//       />
//     </div>
//   );
// };

// export default BookReader;

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Book {
  title: string;
  pages: string[];
}

const BookReader = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch("/api/books");
        const books = await res.json();
        if (books.length > 0) {
          setBook(books[0]); // Load the first book
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage((prev) => Math.min(prev + 1, book?.pages?.length ? book.pages.length - 1 : 0)),
    onSwipedRight: () => setCurrentPage((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });
  const router = useRouter();

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  return (
    
    // <div {...handlers} className="w-screen h-screen overflow-hidden relative">
    //   <button 
    //     className="absolute top-4 left-4 bg-black text-white p-2 rounded-full z-50"
    //     onClick={() => router.back()} 
    //   >
    //     <X size={24} />
    //   </button>
    //   <Image 
    //     src={book.pages[currentPage]} 
    //     alt={`Page ${currentPage + 1}`} 
    //     fill 
    //     className="object-cover w-full h-full"
    //     priority
    //   />
    // </div>

    <div
  {...handlers}
  className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center bg-black"
  >
  <button 
    className="absolute top-4 left-4 bg-black text-white p-2 rounded-full z-50"
    onClick={() => router.back()} 
  >
    <X size={24} />
  </button>
  <Image 
    src={book.pages[currentPage]} 
    alt={`Page ${currentPage + 1}`} 
    fill 
    className="object-cover" 
    priority
  />
</div>
  );
};

export default BookReader;


