// footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-center items-center bg-gray-800 p-4 w-full">
      <Link href="/" passHref>
        <button className="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Home
        </button>
      </Link>
      <Link href="/forum" passHref>
        <button className="mx-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
          Forum
        </button>
      </Link>
    </footer>
  );
}
