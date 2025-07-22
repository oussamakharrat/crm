import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

// Add your CSS imports back one by one:
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/phoenix/v1.20.1/assets/css/theme.min.css';
import '../public/phoenix/v1.20.1/assets/css/user.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);