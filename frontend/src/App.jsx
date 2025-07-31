import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ShopLoginPage from "./pages/ShopLoginPage";
import ShopRegisterPage from "./pages/ShopRegisterPage";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import { useAuth } from "./context/AuthContext";

function App() {
  const { theme } = useThemeStore();
  const { user, authLoading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

if (authLoading) return <div className="loading loading-lg"></div>;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Homepage /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <ShopLoginPage /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <ShopRegisterPage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
