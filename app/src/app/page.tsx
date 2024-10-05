import Image from "next/image";
import Message from "./test";
import Footer from './footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-screen" style={{ backgroundColor: "#FCFBF6" }}>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-black">Next.js &times; Defang</h1>
      </main>
      <Footer />
    </div>
  );
}
