"use client";

import { Button, Modal, Alert } from "flowbite-react";
import React, { useState, useRef } from "react";

import Image from "next/image";
import Footer from "./footer";
import MapComponent from "./MapComponent";
import {
  HiOutlineArrowRight,
  HiCamera,
  HiFolder,
  HiInformationCircle,
} from "react-icons/hi";
import { auto } from "openai/_shims/registry.mjs";

function NoImageAlert() {
  return (
    <Alert color="failure" icon={HiInformationCircle}>
      <span className="font-medium">No Image Selected</span>
    </Alert>
  );
}

function ShowImage({ file }) {
  if (!file) return null;
  const imageUrl = URL.createObjectURL(file);
  return (
    <img
      src={imageUrl}
      alt="Uploaded Image"
      style={{ width: "30vw", height: "30vw", objectFit: "cover" }}
    />
  );
}

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);

  const ImageInput = ({ setFile }) => {
    const onChange = async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
      }
    };
    return <input type="file" name="image" onChange={onChange} />;
  };

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
          style={{ width: "40%", height: "auto" }}
        />

        {/* Button to Upload Image */}
        <Button
          onClick={() => setOpenModal(true)}
          outline
          gradientDuoTone="tealToLime"
        >
          UPLOAD IMAGE
        </Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Upload Image</Modal.Header>
          <Modal.Body>
            <div className="space-y-6 flex-grow flex flex-col items-center justify-center">
              <input
                type="file"
                name="image"
                ref={fileInput}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setIsVisible(false);
                }}
                style={{ display: "none" }}
              />
              <Button
                className="upload-btn"
                onClick={() => {
                  fileInput.current.click();
                }}
              >
                <HiFolder className="mr-2 h-5 w-5" />
                Choose File
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button>
                <HiCamera className="mr-2 h-5 w-5" />
                Take Photo
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {isVisible ? <NoImageAlert /> : <ShowImage file={file} />}
            </div>
            <div className="flex flex-col items-end justify-start">
              <Button
                color="red"
                className="items-end"
                onClick={() => setOpenModal(false)}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
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
