import Footer from "../footer";
import { useLocation } from "react-router-dom";

import { Alert } from "flowbite-react";
import React from "react";
import {
  HiExclamation,
  HiExclamationCircle,
  HiEmojiHappy,
} from "react-icons/hi";
import { GiTripleClaws, GiDeadWood } from "react-icons/gi";

function CalcEndangeredLevel() {
  return (
    <Alert color="warning" icon={HiExclamationCircle}>
      <span className="text-3xl">Medium</span>
    </Alert>
  );
}

function CalcThreatLevel() {
  return (
    <Alert color="failure" icon={HiExclamation}>
      <span className="text-3xl">High</span>
    </Alert>
  );
}

export default function ResponsePage() {
  const { state: { image, result } = {} } = useLocation();
  const imageUrl = URL.createObjectURL(image);

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
              <h1 className="text-4xl mb-9">This is a... Your mom!</h1>
              <div className="flex flex-row mb-1">
                <h1 className="text-3xl">Threat Level </h1>
                <GiTripleClaws className=" ml-5 text-3xl" />
              </div>
              {CalcThreatLevel()}
              <div className="flex flex-row mb-1 mt-2">
                <h1 className="text-3xl">Endangered Level </h1>
                <GiDeadWood className=" ml-5 text-3xl" />
              </div>
              {CalcEndangeredLevel()}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 rounded-md p-1 mx-10">
        <div
          className="h-full w-full rounded-md flex flex-col justify-around p-4"
          style={{ backgroundColor: "#ffffff" }}
        >
          Oop {JSON.stringify(result)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
