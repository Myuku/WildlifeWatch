"use client";
import Footer from "../footer";
import { useLocation } from "react-router-dom";

import { Alert, Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  HiExclamation,
  HiExclamationCircle,
  HiEmojiHappy,
} from "react-icons/hi";
import { GiTripleClaws, GiDeadWood } from "react-icons/gi";

function CalcEndangeredLevel(result) {
  if (
    result["details"]["conservation_status"]
      .toLowerCase()
      .search("endangered") != -1 ||
    result["details"]["conservation_status"]
      .toLowerCase()
      .search("vulnerable") != -1
  )
    return (
      <div className="flex flex-col">
        <Alert color="warning" icon={HiExclamationCircle}>
          <span className="text-2xl">
            {result["details"]["conservation_status"]}
          </span>
        </Alert>
        <p className="text-red-500">
          Please contact your local authorities if spotted!
        </p>
      </div>
    );
  return (
    <Alert color="warning" icon={HiExclamationCircle}>
      <span className="text-2xl">
        {result["details"]["conservation_status"]}
      </span>
    </Alert>
  );
}

function CalcThreatLevel(result) {
  return (
    <Alert color="failure" icon={HiExclamation}>
      <span className="text-2xl">{result["details"]["aggressiveness"]}</span>
    </Alert>
  );
}

export default function ResponsePage() {
  const { state: { image, result } = {} } = useLocation();
  const imageUrl = URL.createObjectURL(image);
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#FCFBF6" }}
    >
      <div className="flex flex-row justify-around m-10">
        <div
          style={{
            width: "50%",
            flex: "1",
            position: "relative",
            marginRight: "2%",
          }}
        >
          <img
            src={imageUrl}
            className="rounded-lg"
            alt="Uploaded Image"
            style={{
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              position: "absolute",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ width: "50%", marginLeft: "2%" }}>
          <div className="bg-gradient-to-br from-teal-300 to-lime-300 rounded-md p-1">
            <div
              className="h-full w-full rounded-md flex flex-col justify-around p-4"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h1 className="text-4xl mb-9">
                This is a... <b>{result["animal"]}</b>!
              </h1>
              <div className="flex flex-row mb-1">
                <h1 className="text-3xl">Threat Level </h1>
                <GiTripleClaws className=" ml-5 text-3xl" />
              </div>
              {CalcThreatLevel(result)}
              <div className="flex flex-row mb-1 mt-2">
                <h1 className="text-3xl">Endangered Level </h1>
                <GiDeadWood className=" ml-5 text-3xl" />
              </div>
              {CalcEndangeredLevel(result)}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 rounded-md p-1 mx-10">
        <div
          className="h-full w-full rounded-md flex flex-col justify-around p-4"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h1 className="text-4xl mb-5">More Information!</h1>
          <h2 className="text-2xl mb-2">Scientific Name</h2>
          <p>{result["details"]["scientific_name"]}</p>
          <h2 className="text-2xl my-2">Visual Appearance</h2>
          <p>{result["details"]["visual_appearance"]}</p>
          <h2 className="text-2xl my-2">Species Range</h2>
          <p>{result["details"]["species_range"]}</p>
          <h2 className="text-2xl my-2">Diet</h2>
          <p>{result["details"]["diet"]}</p>
          <h2 className="text-2xl my-2">Diurnality</h2>
          <p>{result["details"]["diurnality"]}</p>
        </div>
      </div>
      <div className="flex flex-row justify-center m-10">
        <Button
          onClick={() => {
            navigate("/");
          }}
          outline
          gradientDuoTone="tealToLime"
        >
          Return to Home
        </Button>
      </div>

      <Footer />
    </div>
  );
}
