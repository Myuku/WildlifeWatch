"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import ResponsePage from "./pages/response";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/response" element={<ResponsePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
