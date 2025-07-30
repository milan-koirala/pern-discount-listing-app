import { useEffect } from "react";
import Navbar from "./components/Navbar";
import DiscountListingPage from "./pages/DiscountListingPage";
import { Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";


import Homepage from "./pages/Homepage";
import ShopLoginPage from "./pages/ShopLoginPage";
import ShopRegisterPage from "./pages/ShopRegisterPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("preferred-theme") || "forest";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      {/* <ShopLoginPage/> */}
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/shops/:id" element={<DiscountListingPage />} /> */}
        <Route path="/login" element={<ShopLoginPage />} />
        <Route path="/register" element={<ShopRegisterPage />} />

      </Routes>

      <Toaster />

    </div>
  );
}

export default App;