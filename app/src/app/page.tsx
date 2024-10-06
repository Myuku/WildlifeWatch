"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

import Image from "next/image";
import Footer from './footer';
import React from 'react';


export default function Home() {
  const [openModal, setOpenModal] = useState(true);
  return (
    <div
      className="flex flex-col min-h-screen min-w-screen"
      style={{ backgroundColor: "#FCFBF6" }}
    >
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

        {/*   Button to Upload Image  */}
        <button
          onClick={() => setOpenModal(true)}
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            UPLOAD IMAGE
          </span>
        </button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpenModal(false)}>I accept</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>

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
