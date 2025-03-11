import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center flex-col bg-gray-100">
      <h1 className="text-2xl font-bold">Welcome to Sochu Book Reader</h1>
      <Link href="/reader">
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Start Reading
        </button>
      </Link>
    </div>
  );
}
