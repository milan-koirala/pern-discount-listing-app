import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { useThemeStore } from "./store/useThemeStore"; 


useThemeStore.getState();


createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter>
      {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
    </BrowserRouter>
  </AuthProvider>
  // </StrictMode>,
);