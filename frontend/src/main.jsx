import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

//! Important key ================================>
/*
<script
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA"
  async
  defer
></script>
*/
//! Important key ================================>
