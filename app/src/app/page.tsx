import Image from "next/image";
import Footer from "./footer"; // Import the Footer component

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center bg-gradient-defang">
      <h1 className="text-4xl font-bold text-white">Next.js &times; Defangssss</h1>
      {/* Other content of the page */}
      
      {/* Implement Footer */}
      <Footer />
    </main>
  );
}
