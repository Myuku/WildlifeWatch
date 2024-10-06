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
import { useNavigate } from "react-router-dom";

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

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  // Handler to update the current location from MapComponent
  const handleLocationChange = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
  };

  // Function to round to 4 decimal places
  const roundToFour = (num: number) => {
    return Math.round(num * 10000) / 10000;
  };

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

  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#FCFBF6" }}
    >
      {/* Header Section */}
      <header className="flex flex-col items-center py-6">
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
        {/* Line with current location */}
        <p className="text-gray-600 mt-4 text-sm">
          You are at: Latitude {roundToFour(currentLocation.lat)}, Longitude{" "}
          {roundToFour(currentLocation.lng)}
        </p>

        {/* Modal for Uploading Image */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Upload Image</Modal.Header>
          <Modal.Body>
            <div className="space-y-6 flex-grow flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-around gap-x-4">
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
              </div>

              {isVisible ? <NoImageAlert /> : <ShowImage file={file} />}
            </div>
            <Modal.Footer className="mt-6">
              <div className="flex flex-col items-end justify-start">
                <Button
                  disabled={isVisible}
                  color="green"
                  className="items-end"
                  onClick={() => {
                    navigate("/response");
                  }}
                >
                  Continue
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </header>

      {/* Main Section - Larger Map */}
      <main className="flex-grow flex justify-center items-center">
        {/* Larger map container */}
        <div className="w-full max-w-6xl p-6">
          <MapComponent onLocationChange={handleLocationChange} />
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
