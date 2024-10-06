"use client";

import { Button, Modal, Alert, Toast } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";

import Image from "next/image";
import Footer from "../footer";
import MapComponent from "../MapComponent";
import {
  HiOutlineArrowRight,
  HiCamera,
  HiFolder,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function NoImageAlert() {
  return (
    <Alert color="failure" icon={HiInformationCircle}>
      <span className="font-medium">No Image Selected</span>
    </Alert>
  );
}

function NotImplemented() {
  return (
    <div className="flex flex-col gap-4">
      <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red200">
          <HiX className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">
          Sorry! This Feature is coming soon!
        </div>
        <Toast.Toggle />
      </Toast>
    </div>
  );
}

function ShowImage({ file }) {
  if (!file) return null;
  const imageUrl = URL.createObjectURL(file);
  return (
    <img
      src={imageUrl}
      alt="Uploaded Image"
      style={{
        width: "30vw",
        height: "30vw",
        objectFit: "cover",
        borderRadius: "10%",
      }}
    />
  );
}

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [showNIY, setShowNIY] = useState(false);
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
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<JSON | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  // Turns the NIY Toast off after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNIY(false);
    }, 2000);
  }, [showNIY]);

  const navigate = useNavigate();

  const handleAnalysis = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file!);
    formData.append(
      "location",
      JSON.stringify({ lat: currentLocation.lat, lng: currentLocation.lng })
    );

    try {
      const response = await fetch("/image-analysis", {
        method: "POST",
        body: formData,
      });
      setResult(await response.json());
      console.log(result);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#FCFBF6" }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center py-6">
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
                    setFile(e.target.files![0]);
                    setIsVisible(false);
                  }}
                  style={{ display: "none" }}
                />
                <Button
                  className="upload-btn"
                  onClick={() => {
                    fileInput.current!.click();
                  }}
                >
                  <HiFolder className="mr-2 h-5 w-5" />
                  Choose File
                  <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button onClick={() => setShowNIY((state) => !state)}>
                  <HiCamera className="mr-2 h-5 w-5" />
                  Take Photo
                  <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {showNIY && NotImplemented()}
              {isVisible ? <NoImageAlert /> : <ShowImage file={file} />}
            </div>
            <Modal.Footer className="mt-6">
              <div className="flex flex-col items-end justify-start">
                <Button
                  disabled={isVisible}
                  color="green"
                  className="items-end"
                  onClick={() => {
                    handleAnalysis;
                    navigate("/response", {
                      state: { image: file, result: result },
                    });
                  }}
                >
                  Continue
                </Button>
              </div>
              {isVisible ? null : (
                <p className="text-red-400">
                  Please note that it may take a while to load...
                </p>
              )}
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </div>

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
