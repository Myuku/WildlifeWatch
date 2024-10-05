import Image from "next/image";
import Message from "./test";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center bg-gradient-defang">
      <h1 className="text-4xl font-bold text-white">Next.js &times; Defang</h1>
      <div className="text-9xl font-bold"><Message /></div>
    </main>
  );
}
