import Image from "next/image";
import Footer from './footer';
import React from 'react';
import MapComponent from './MapComponent';  // Import the client-side MapComponent
import 'reactjs-popup/dist/index.css';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-screen" style={{ backgroundColor: "#FCFBF6" }}>
      <main className="flex-grow flex flex-col items-center justify-center">
        {/* Logo */}
        <Image 
          src="/logo.jpeg" 
          alt="Wildlife Watch Logo" 
          width={0} 
          height={0} 
          sizes="100vw" 
          style={{ width: '40%', height: 'auto' }} 
        />

        {/* Button to Upload Image */}
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            UPLOAD IMAGE
          </span>
        </button>

        {/* Google Map */}
        <div className="w-full h-96 mt-8">
          <MapComponent />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
