import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Temp from "./temp.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Temp />
  </StrictMode>
);
