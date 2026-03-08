import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ServerWake from "./components/ServerWake";
import FloatingChat from "./components/FloatingChat";
import CookieBanner from "./components/CookieBanner";
import App from "./App";
import "./App.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ServerWake>
        <App />
        <FloatingChat />
        <CookieBanner />
      </ServerWake>
    </AuthProvider>
  </BrowserRouter>
);