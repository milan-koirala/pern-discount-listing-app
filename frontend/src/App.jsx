import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ShopLoginPage from "./pages/ShopLoginPage";
import ShopRegisterPage from "./pages/ShopRegisterPage";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import { useAuth } from "./context/AuthContext";
import ManageShopPage from "./pages/ManageShopPage";
import Homepage from "./pages/HomePage";

function App() {
  const { theme } = useThemeStore();
  const { user, authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ❌ Hide Navbar on these routes
  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  if (authLoading) return <div className="loading loading-lg"></div>;

  return (
    <div className="min-h-screen bg-base-200">
      {showNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!user ? <ShopLoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <ShopRegisterPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/manage-shop"
          element={user ? <ManageShopPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
