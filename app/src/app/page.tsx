"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./home";
import ResponsePage from "./response";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/responsepage" element={<ResponsePage />} />
      </Routes>
    </BrowserRouter>
  );
}
