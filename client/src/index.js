import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import Validate from "./validate";

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/validate" element={<Validate />} />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>,

  document.getElementById("root")
);
